import hbs from 'handlebars';
import hbsHelpers from '../../utils/hbsHelpers.js';
import path from 'path';
import { happyLog } from '../../utils/utils.js';
import fs from 'fs-extra';
import globalConfig from '../../../config/config.json';

const COMMAND = 'cpf';
const Handlebars = hbsHelpers(hbs);

export function cpf(stepOptions = {}, context = {}, options = {}) {
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
        happyLog(`..Going to generate ${absoluteToPath}`);
        happyLog(`..Based on ${absoluteWhatPath}`);
    }

    let contents;
    try {
        contents = fs.readFileSync(absoluteWhatPath, globalConfig.fileEncoding);
    } catch (error) {
        return `...."${COMMAND}" failed with ${error}`;
    }

    const contentsTemplate = Handlebars.compile(contents);
    let properContent = contentsTemplate(context);

    const regexOpenTag = new RegExp(context._tOpenTag, 'gi');
    const regexCloseTag = new RegExp(context._tCloseTag, 'gi');

    properContent = properContent.replace(regexOpenTag, '{{');
    properContent = properContent.replace(regexCloseTag, '}}');

    try {
        fs.writeFileSync(absoluteToPath, properContent, globalConfig.fileEncoding);
    } catch (error) {
        return `...."${COMMAND}" failed with ${error}`;
    }

    if (isVerbose) {
        happyLog(`....Generated ${absoluteToPath}`);
    }

    return;
}
