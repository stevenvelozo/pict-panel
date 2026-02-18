# Hotload

## Short Form

```
fetch('./pict-panel.js').then(r=>r.text()).then(eval).then(()=>PictPanel.inject())
```

## Long Form

You can hotload this into any browser from CDN By using the following snippet:

```javascript
fetch('./pict-panel.js')
  .then(response => response.text())
  .then(scriptText => {
    eval(scriptText);
    console.log('Remote script executed successfully.');
	_Pict.addProvider('PictPanel', {}, PictPanel);
	_Pict.providers.PictPanel.show();
  })
  .catch(error => {
    console.error('Error loading or executing remote script:', error);
  });
```

