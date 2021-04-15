export const templateRevealHml = 
`
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />

  <title>Dora Presentation Player</title>

  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

  <link rel="stylesheet" href="./reveal.css" />
  <link rel="stylesheet" href="./theme/white.css" id="theme" />
</head>

<body>
  <div class="reveal">
    <div class="slides">
      <section>
        <h2>Examples of embedded Video, Audio and Iframes</h2>
      </section>

      <section>
        <h2>Iframe</h2>
        <iframe data-autoplay width="700" height="540" src="https://slides.com/news/auto-animate/embed"
          frameborder="0"></iframe>
      </section>

      <section data-background-iframe="https://www.youtube.com/embed/h1_nyI3z8gI" data-background-interactive>
        <h2 style="color: #fff">Iframe Background</h2>
      </section>

      <section>
        <h2>Video</h2>
        <video src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" data-autoplay></video>
      </section>

      <section data-background-video="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4">
        <h2>Background Video</h2>
      </section>
    </div>
  </div>

  <script src="./reveal.js"></script>
  <script>
    Reveal.initialize({ hash: true });
  </script>
</body>

</html>
`;