import hbs from 'handlebars';
import hbsHelpers from '../../utils/hbsHelpers.js';
import mkdirp from 'mkdirp';
import path from 'path';
import { happyLog } from '../../utils/utils.js';

const COMMAND = 'mkdir';
const Handlebars = hbsHelpers(hbs);

export function mkdir(stepOptions = {}, context = {}, options = {}) {
    const { isVerbose } = options;

    if (!stepOptions.path) {
        return `"${COMMAND}" is missing "path" property`;
    }

    console.log('context', context);
    const pathTemplate = Handlebars.compile(stepOptions.path);
    const properPath = pathTemplate(context).replace(/\/\//gi, '/');
    const absolutePath = path.resolve(properPath);

    if (isVerbose) {
        happyLog(`..Going to generate ${absolutePath}`);
    }

    try {
        mkdirp.sync(properPath);
    } catch (error) {
        return `...."${COMMAND}" failed with ${error}`;
    }

    if (isVerbose) {
        happyLog(`....Generated ${absolutePath}`);
    }
}
