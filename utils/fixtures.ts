import { test as base, Fixtures } from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';
import { APILogger } from './api-logger';


// Defining the shape of custom fixtures
type ApiFixtures = {
    api: RequestHandler;
};

// Passing that type into extend<>, and EXPORTing the result as 'test'
export const test = base.extend<ApiFixtures>({
    //create our fixture, responsible for the test setup for every .spec file ie instantiate requesthandler or pre-requities
    api: async ({ request }, use) => {
        const baseUrl = 'http://localhost:3000'
        const logger = new APILogger()
        const requestHandler = new RequestHandler(request, baseUrl, logger)
        await use(requestHandler)

        // teardown — clears per-request state
        requestHandler.reset()


    }
})


// Re-exporting expect so the spec files only need one import ie import { test, expect } from '../fixtures/fixture'
export { expect } from '@playwright/test';
