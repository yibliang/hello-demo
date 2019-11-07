const server = require('express')()
const path = require('path')
const express = require('express')
const { createBundleRenderer } = require("vue-server-renderer");
const bundle = require("./dist/vue-ssr-server-bundle.json");
const clientManifest = require("./dist/vue-ssr-client-manifest.json");


const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: require('fs').readFileSync(("./index.template.html"), "utf-8"),
    clientManifest: clientManifest
})

server.use(express.static(path.join(__dirname, 'dist')))


server.get('/',(req,res)=>{
    const context = {
        title: 'hello',
        url: req.url
    }
    renderer.renderToString(context, (err, html) => {
        // const { title,meta } = context.meta.inject()
        console.log(err);
        if (err) {
            res.status(500).end('Internal Server Error')
            return
        }
        // html = html.replace(/<title.*?<\/title>/g,context.title)
        // html = html.replace(/<meta\s+.*?name="description".*?>/g,meta.text())
        res.end(html)
    })
})
server.listen(8081,()=>console.log('Example app listening on port 8081'))
