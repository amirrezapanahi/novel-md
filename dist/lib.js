"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToEditorState = exports.markdownToHtml = exports.htmlToMarkdown = exports.isWhiteSpaceOnly = void 0;
const react_1 = require("@tiptap/react");
const HTMLConverter = require("node-html-markdown/dist");
const starter_kit_1 = require("@tiptap/starter-kit");
const extension_link_1 = require("@tiptap/extension-link");
const extension_image_1 = require("@tiptap/extension-image");
const extension_task_item_1 = require("@tiptap/extension-task-item");
const extension_task_list_1 = require("@tiptap/extension-task-list");
const showdown_1 = require("showdown");
const isWhiteSpaceOnly = (s) => !/\S/.test(s);
exports.isWhiteSpaceOnly = isWhiteSpaceOnly;
const options = {
    preferNativeParser: false,
    bulletMarker: '-',
};
const htmlToMarkdown = (editorContent) => {
    const md = HTMLConverter.NodeHtmlMarkdown.translate(editorContent, options, {
        'li': ({ node, options: { bulletMarker }, indentLevel, listKind, listItemNumber }) => {
            const indentationLevel = +(indentLevel || 0);
            let checkboxState = '';
            const attributes = JSON.parse(JSON.stringify(node.attributes));
            console.log(attributes);
            if (attributes["class"] == 'novel-flex novel-items-start novel-my-4') {
                if (attributes['data-checked']) {
                    return {
                        prefix: '   '.repeat(indentationLevel),
                        postprocess: ({ content }) => attributes['data-checked'] == "true" ? `- [x] ${content}` : `- [ ] ${content}`
                    };
                }
            }
            return {
                prefix: '   '.repeat(indentationLevel) + checkboxState +
                    (((listKind === 'OL') && (listItemNumber !== undefined)) ? `${listItemNumber}. ` : `${bulletMarker} `),
                surroundingNewlines: 1,
                postprocess: ({ content }) => content.trim()
                    .replace(/([^\r\n])(?:\r?\n)+/g, `$1  \n${'   '.repeat(indentationLevel)}`)
                    .replace(/(\S+?)[^\S\r\n]+$/gm, '$1  ')
            };
        }
    });
    return md;
};
exports.htmlToMarkdown = htmlToMarkdown;
const markdownToHtml = (markdownContent) => {
    function processLines(lines) {
        let result = '';
        let currentList = [];
        lines.forEach((line) => {
            const unorderedMatch = line.match(/(- \[[ xX]\]) (.+)$/);
            const orderedMatch = line.match(/(\d+\. \[[ xX]\]) (.+)$/);
            let match, isChecked;
            if (unorderedMatch || orderedMatch) {
                match = unorderedMatch || orderedMatch;
                if (!match)
                    return;
                isChecked = match[1].toLowerCase().includes('x');
                const content = match[2].trim();
                const innerHtml = new showdown_1.Converter().makeHtml(content);
                currentList.push(`<li class="novel-flex novel-items-start novel-my-4" data-checked="${isChecked}" data-type="taskItem"><label><input type="checkbox" ${isChecked ? 'checked' : ''}><span></span></label><div>${innerHtml}</div></li>`);
            }
            else {
                result += line + '\n';
            }
        });
        if (currentList.length > 0) {
            result += '<ul>\n' + currentList.join('\n') + '\n</ul>\n';
        }
        return result;
    }
    const todoListExt = {
        type: 'lang',
        regex: /- \[( |x)\] (.+)/gi,
        replace: function (match, checked, content) {
            const isChecked = checked.toLowerCase() === 'x';
            const innerHtml = new showdown_1.Converter().makeHtml(content);
            return `<li class="novel-flex novel-items-start novel-my-4" data-checked="${isChecked}" data-type="taskItem"><label><input type="checkbox" ${isChecked ? 'checked' : ''}></label><div>${innerHtml}</div></li>`;
        }
    };
    const removePTagExt = {
        type: 'output',
        regex: /<p>(<li .+?<\/li>)<\/p>/g,
        replace: '$1'
    };
    const markdownConverter = new showdown_1.Converter({ extensions: [todoListExt, removePTagExt] });
    const html = markdownConverter.makeHtml(markdownContent);
    const cleanedHtml = html.replace(/<p><\/p>/g, '');
    return cleanedHtml;
};
exports.markdownToHtml = markdownToHtml;
const htmlToEditorState = (html) => {
    const json = (0, react_1.generateJSON)(html, [starter_kit_1.default, extension_link_1.default, extension_image_1.default, extension_task_item_1.default, extension_task_list_1.default]);
    return json;
};
exports.htmlToEditorState = htmlToEditorState;
