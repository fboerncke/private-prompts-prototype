require('dotenv').config();
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
    console.log('  • Notarizing via custom-notarize.js instead ...');
    const { electronPlatformName, appOutDir } = context;
    if (
        electronPlatformName !== "darwin" ||
        !process.env.APPLE_ID ||
        !process.env.APPLE_APP_SPECIFIC_PASSWORD
    ) {
        console.log(
            "Not running notarize. Platform is not macOS or environment not set up."
        );
        return;
    }

    const appName = context.packager.appInfo.productFilename;
    console.log(`  • Notarizing signed file ${appOutDir}/${appName}.app`);

    return await notarize({
        tool: 'notarytool',
        teamId: process.env.APPLE_TEAM_ID,
        appBundleId: 'org.privateprompts.app',
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    });
};
