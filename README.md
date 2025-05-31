# pict-panel

## Hotloading

You can hotload this into any browser from CDN By using the following snippet:

```javascript
fetch('./pict-panel.min.js')
  .then(response => response.text())
  .then(scriptText => {
    eval(scriptText);
    console.log('Remote script executed successfully.');
  })
  .catch(error => {
    console.error('Error loading or executing remote script:', error);
  });
```