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

## Related Packages

- [pict](https://github.com/stevenvelozo/pict) - MVC application framework
- [pict-view](https://github.com/stevenvelozo/pict-view) - View base class
- [pict-template](https://github.com/stevenvelozo/pict-template) - Template engine
- [pict-provider](https://github.com/stevenvelozo/pict-provider) - Data provider base class

## License

MIT

## Contributing

Pull requests are welcome. For details on our code of conduct, contribution process, and testing requirements, see the [Retold Contributing Guide](https://github.com/stevenvelozo/retold/blob/main/docs/contributing.md).
