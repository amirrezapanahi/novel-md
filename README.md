# Novel.sh : bi-directional markdown import & export
---
Convert your Notion-style block editor to Markdown in real-time, and also read the Markdown to accurately restore the editor's state.

Useful for:
1. Future-proofing written content
2. Having a flexible intuitive editor which is able to write to a file format that is universally known

Still needs work:
- [ ] Nested structures
- [ ] Image drag and drop from web

Feel free to contribute and use!!

---
## Install

```
$ npm install novel-md 
```

## Usage

using the !(novel)[https://github.com/steven-tey/novel] editor `Editor` we can get the editor state from the onUpdate callback. From there we can perform the conversion to markdown

```jsx
  <Editor onUpdate={(editor: Editor ) => {
      const html: string = editor.getHTML()
      const md: string = htmlToMarkdown(html)
  }} />
```

Here is how to set the default state of the editor to the imported markdown. It is first converted from markdown into html, and then to the editor state


```jsx
  const md = "# Hello world!"
  const html = markdownToHtml(md)
  const editorState = htmlToEditorState(html)
  ...
  <Editor defaultValue={editorState} />
  ...
```

