# Troubleshooting

## Preloading the LCP Element

To improve your Largest Contentful Paint (LCP) time, you should add the following `<link>` tags to the `<head>` section of your `index.html` file. This tells the browser to start loading your cover page videos as soon as possible.

```html
<link rel="preload" href="/_media/turt.webm" as="video" type="video/webm">
<link rel="preload" href="/_media/turt.mp4" as="video" type="video/mp4">
```


## Font Loading

To prevent your fonts from blocking the rendering of your page, you should add the following `<style>` block to the `<head>` section of your `index.html` file. This will ensure that the browser displays fallback text while your fonts are loading.

```html
<style>
  @font-face {
    font-display: swap;
  }
</style>
```
