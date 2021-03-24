import webdriver, { By, Capabilities, until, WebDriver, WebElement } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";

describe('main e2e test', () => {
    let driver: WebDriver;

    beforeEach(() => {
        jest.setTimeout(30000);
        if(process.env.USE_LOCAL === "true") {
            let options = new firefox.Options()
            if(process.env.DISABLE_HEADLESS !== "true") {
                options.headless();
            }
            driver = new webdriver.Builder()
                .forBrowser("firefox")
                .setFirefoxOptions(options)
                .build();
        } else {
            driver = new webdriver.Builder()
                .usingServer("http://localhost:4444/wd/hub")
                .withCapabilities(Capabilities.firefox())
                .build();
        }
    })

    it("should run properly", async () => {
        // get the main web page
        await driver.get('http://dev-app.brillder.com');

        const title = await driver.getTitle();
        expect(title).toBeTruthy();

        // LOG IN
        const emailButton = await driver.wait(until.elementLocated(By.className("email-button")), 10000);
        await emailButton.click();

        const emailField = await driver.findElement(By.css("input[type=email].login-field"))
        const passwordField = await driver.findElement(By.css("input[type=password].login-field.password"))

        await emailField.sendKeys("admin@test.com");
        await passwordField.sendKeys("password");

        const signInButton = await driver.findElement(By.className("sign-in-button"));
        signInButton.click();

        const welcomeBox = await driver.wait(until.elementLocated(By.className("welcome-box")), 2000);
        expect(welcomeBox).toBeTruthy();

        // MANAGE CLASSES
        const manageClassesButton = await driver.findElement(By.className("manage-classes"));
        await manageClassesButton.click();

        // -- CREATE A CLASS
        const createClassButton = await driver.wait(until.elementLocated(By.className("create-class-button")), 2000);
        await createClassButton.click();

        const classNameString = `Test Class (${new Date().toUTCString()})`;
        const classNameField = await driver.wait(until.elementLocated(By.css("input[placeholder=\"Class Name\"")), 2000);
        await classNameField.sendKeys(classNameString);

        const classSubjectField = await driver.wait(until.elementLocated(By.css(".dialog-select-container .MuiSelect-root")));
        await classSubjectField.click();

        const compSciSubjectButton = await driver.wait(until.elementLocated(By.css(".MuiPopover-root li[data-value=\"5\"].MuiButtonBase-root.MuiListItem-root")));
        await compSciSubjectButton.click();

        const createButton = await driver.wait(until.elementLocated(By.css(".dialog-footer .yes-button")), 2000);
        const waitClick = async (element: WebElement) => {
            try {
                await element.click();
                return true;
            } catch {
                return false;
            }
        }
        await driver.wait(() => waitClick(createButton), 2000);

        // -- DELETE THE CLASS
        const sidebarClass = await driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), 'student-drop-item') and label/span/text()='${classNameString}']`)), 5000);
        const removeClassButton = await sidebarClass.findElement(By.className("remove-class"));
        await removeClassButton.click();

        const confirmButton = await driver.wait(until.elementLocated(By.className("yes-button")), 2000);
        await confirmButton.click();

        // check that class has disappeared from sidebar.
        expect(driver.wait(until.elementLocated(By.xpath(`//div[contains(concat(' ', @class, ' '), 'student-drop-item') and label/span/text()='${classNameString}']`)), 5000)).rejects.toThrow();
    });

    afterEach(async () => {
        if(process.env.KEEP_OPEN !== "true") {
            await driver.quit();
        }
    })
});
