# LongStoryPress
Headless WordPress configured for nginx as a reverse proxy for a node server with a (ssr enabled) react frontend. Designed to be a multisite where each subsite is paired with a branch [LSP_UI](https://github.com/LongStoryMedia/LSP_UI). See [example.com](https://github.com/LongStoryMedia/LSP_UI/tree/master/example.com) for example starter config. Customize as much or as little of the [default react app](https://github.com/LongStoryMedia/LSP_UI/tree/master/src/shared) as desired for each site. Import modules from the default app as `import Module from 'LSP/Module'`, and vice-versa as `import Module from 'Site/Module'`. The [build script](https://github.com/LongStoryMedia/LSP_UI/blob/master/scripts/build.js) will write an [nginx server block](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/) called 'server.conf'. Make sure you `include` this path in the main conf file (probably in `/etc/nginx/sites-available/YourMultiSiteServerBlock`).
# Quick Start
```
git clone --recurse-submodules https://github.com/LongStoryMedia/LongStoryPress.git \
&& cd LongStoryPress \
&& bash lsp-install
```
