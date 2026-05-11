import { expect, test } from '../utils/fixtures';
import { APILogger } from '../utils/api-logger';

let authToken: string
let productId: number
let productDesc: string
let productSearch: string = 'Lemon'
let captchaId: string
let captchaAnswer: string
let feedbackId: number

test.describe('Juice Shop Smoke Test', () => {

    test.describe.configure({ mode: 'serial' })


    // test.beforeAll('Get Token', async ({ api }) => {
    test('Get Token', async ({ api }) => {

        const tokenResponse = await api
            .path('/rest/user/login')
            .body({ "email": "admin@juice-sh.op", "password": "admin123" })
            .postRequest(200)

        authToken = 'Bearer ' + tokenResponse.authentication.token
        // console.log('Token ', authToken)
        console.log('authToken generated\n')
    })

    test('Get/Search for a Product', async ({ api }) => {

        const response = await api
            .path('/api/Products')
            .params({ q: productSearch, limit: 2 })
            .getRequest(200)

        expect(response.data.length).toBeLessThanOrEqual(1)
        productId = response.data[0].id
        productDesc = response.data[0].description
        console.log(`Search ${productSearch} response: `, response)
        // console.log(`Expected response: ${JSON.stringify(response, null, 2)}`) //Explicit serialize → plain text, no color

    })

    test('Add a comment to the product', async ({ api }) => {
        const commentResponse = await api
            .path(`/rest/products/${productId}/reviews`)
            .headers({ Authorization: authToken })
            .body({ "message": `Seems like ${productDesc}!`, "author": "admin@juice-sh.op" })
            .putRequest(201)

        expect(commentResponse.status).toEqual('success')
        console.log('Add Comment response: ', commentResponse)
    })


    test('Get all products', async ({ api }) => {
        const response = await api
            .path('/api/Products')
            .params({ limit: 100 })
            .getRequest(200)

        expect(response.data[0].name).toEqual('Apple Juice (1000ml)')
        expect(response.data.length).toBe(36);
        console.log('Get all products; count: ', response.data.length)
    })


    test('Get captcha and post Feedback', async ({ api }) => {

        const captchaResponse = await api
            .path('/rest/captcha/')
            .getRequest(200)

        captchaId = String(eval(captchaResponse.captchaId))
        captchaAnswer = String(eval(captchaResponse.captcha))

        console.log('CaptchaId :', captchaId, '\ncaptchaAnswer: ', captchaAnswer);
        console.log('Captcha response: ', captchaResponse)


        const response = await api
            .path('/api/Feedbacks')
            .headers({ 'Content-Type': 'application/json', 'Authorization': authToken })
            .body({
                "comment": "Great shop!!!!!",
                "rating": 4,
                "captchaId": captchaId,
                "captcha": captchaAnswer,
                "UserId": 1
            })
            .postRequest(201)

        feedbackId = response.data.id

        console.log('Captcha generated; Feedback Response:', response)
    })

    test('Delete the Feedback', async ({ api }) => {

        const response = await api
            .path(`/api/Feedbacks/${feedbackId}`)
            .headers({ 'Authorization': authToken })
            .deleteRequest(200)

        console.log(`Deleted feedbackId: ${feedbackId} \nResponse: `, response)

    })


})
