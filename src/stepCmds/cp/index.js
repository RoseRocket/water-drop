import path from 'path';
import { happyLog } from '../../utils/utils.js';
import fs from 'fs';

const COMMAND = 'cp';

export function cp(stepOptions = {}, context = {}, options = {}) {
    const { isVerbose } = options;

    if (!stepOptions.what) {
        return `"${COMMAND}" is missing "what" property`;
    }

    if (!stepOptions.to) {
        return `"${COMMAND}" is missing "to" property`;
    }

    const toTemplate = Handlebars.compile(stepOptions.to);
    const properToPath = toTemplate(context).replace(/\/\//gi, '/');
    const absoluteToPath = path.resolve(properToPath);

    const properWhatPath = (`templates/${context.templateType}/` + stepOptions.what).replace(
        /\/\//i,
        '/'
    );
    const absoluteWhatPath = path.resolve(properWhatPath);

    if (isVerbose) {
        happyLog(`..Going to copy ${absoluteToPath}`);
        happyLog(`..Based on ${absoluteWhatPath}`);
    }

    try {
        fs.copyFileSync(absoluteWhatPath, absoluteToPath);
    } catch (error) {
        return `...."${COMMAND}" failed with ${error}`;
    }

    if (isVerbose) {
        happyLog(`....Generated ${absoluteToPath}`);
    }

    return;
}
