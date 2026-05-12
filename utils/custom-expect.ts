import { expect as baseExpect } from "@playwright/test";
import { APILogger } from "./api-logger";

let apiLogger: APILogger


export const setCustomExpectLogger = (logger: APILogger) => {

    apiLogger = logger

}
export const expect = baseExpect.extend({

})