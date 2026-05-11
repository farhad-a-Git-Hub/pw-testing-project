import { APIRequestContext, expect } from "@playwright/test"
import { APILogger } from "./api-logger"


export class RequestHandler {

    private request: APIRequestContext
    private logger: APILogger
    private baseUrl: string = ''
    private defaultBaseUrl: string
    private apiPath: string = ''
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger) {
        this.request = request
        this.defaultBaseUrl = apiBaseUrl
        this.logger = logger
    }


    // request-handler.ts — reset request state between calls, keep baseUrl
    reset(): this {
        this.apiPath = ''
        this.queryParams = {}
        this.apiHeaders = {}
        this.apiBody = {}
        return this
    }


    /**
     * 
     * @param 
     * @returns 
     */

    //request handler, the primary class responsible for managin API requests
    //fluent interface design; returning the same instance of the class ie returning this at the end of execution, we provide access for the method ie url(){} to other non-private methods in the class
    //with this we can chain our methods with the dot notation

    //methods for 5 API call components

    url(url: string) {
        this.baseUrl = url
        return this
    }

    path(path: string) {
        this.apiPath = path
        return this

    }

    params(params: object) {
        this.queryParams = params
        return this
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers
        return this
    }

    body(body: object) {
        this.apiBody = body
        return this
    }


    // HTTP call methods

    async getRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('GET', url, this.apiHeaders)
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        })
        const actualStatus = response.status()
        const responseJSON = await response.json()

        this.logger.logResponse(actualStatus, responseJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
        // expect(actualStatus).toEqual(statusCode)

        return responseJSON
    }

    async postRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody)
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })

        const actualStatus = response.status()
        const responseJSON = await response.json()

        this.logger.logResponse(actualStatus, responseJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.postRequest)
        // expect(actualStatus).toEqual(statusCode)

        return responseJSON
    }

    async putRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody)
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })
        const actualStatus = response.status()
        const responseJSON = await response.json()

        this.logger.logResponse(actualStatus, responseJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
        // expect(actualStatus).toEqual(statusCode)

        return responseJSON
    }

    async deleteRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('DELETE', url, this.apiHeaders)
        const response = await this.request.delete(url, {
            headers: this.apiHeaders,
        })

        const actualStatus = response.status()
        const responseJSON = await response.json()

        this.logger.logResponse(actualStatus, responseJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
        // expect(actualStatus).toEqual(statusCode)
        return responseJSON
    }




    //If baseUrl is not provided or null, then using the default baseUrl
    private getUrl() {
        const url = new URL(`${this.baseUrl || this.defaultBaseUrl}${this.apiPath}`)
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value)
        }
        return url.toString()
    }




    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function) {
        if (actualStatus !== expectedStatus) {
            const logs = this.logger.getRecentLogs()
            const error = new Error(`Expected status code ${expectedStatus} but got ${actualStatus}\n\nRecent API activity: \n${logs}`);
            (Error as any).captureStackTrace(error, callingMethod)
            throw error

        }
    }

}