# Sound effects

The film's effects come from the bundled library of HyperFrames' media tools, sourced from
[Pixabay](https://pixabay.com/sound-effects/) under the
[Pixabay Content License](https://pixabay.com/service/license-summary/): free to use in the film, with no
attribution required (given here anyway). The loose files are not kept in this repository.

To render the film again, put these ten files in `video/assets/sfx/`:

`typing.mp3`, `key-press.mp3`, `click.mp3`, `click-soft.mp3`, `whoosh.mp3`, `whoosh-short.mp3`,
`whoosh-cinematic.mp3`, `notification.mp3`, `pop.mp3`, `impact-bass-1.mp3`

Each one resolves from that library offline, for example:

```sh
npx hyperframes media-use resolve --type sfx --intent "typing" --project video --local-only
```
