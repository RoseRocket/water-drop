import hbs from 'handlebars';
import hbsHelpers from '../../utils/hbsHelpers.js';
import path from 'path';
import { happyLog } from '../../utils/utils.js';
import fs from 'fs-extra';

const COMMAND = 'cp';
const Handlebars = hbsHelpers(hbs);

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

    const properWhatPath = (`${context._tFolder}/${context._mType}/__files/` + stepOptions.what
    ).replace(/\/\//i, '/');
    const absoluteWhatPath = path.resolve(properWhatPath);

    if (isVerbose) {
        happyLog(`..Going to copy ${absoluteToPath}`);
        happyLog(`..Based on ${absoluteWhatPath}`);
    }

    try {
        fs.copySync(absoluteWhatPath, absoluteToPath);
    } catch (error) {
        return `...."${COMMAND}" failed with ${error}`;
    }

    if (isVerbose) {
        happyLog(`....Generated ${absoluteToPath}`);
    }

    return;
}
