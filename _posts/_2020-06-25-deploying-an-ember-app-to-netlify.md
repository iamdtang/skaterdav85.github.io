```
ember new reddit-netlify
cd reddit-netlify
ember s
```

https://www.reddit.com/r/emberjs.json

```
ember g route application
```

```
ember install ember-cli-netlify
```

This addon allows you to configure your Netlify headers and redirects.

[Netlify Rewrites and Proxies](https://docs.netlify.com/routing/redirects/rewrites-proxies/#limitations)

`touch .netlifyredirects`

```
/r/*  https://www.reddit.com/r/:splat  200
/*  /index.html  200
```
