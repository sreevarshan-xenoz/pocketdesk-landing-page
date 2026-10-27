import { renderToStaticMarkup } from 'react-dom/server'
import { SCENES } from './Film'

/** Each film scene as static HTML; ids from useId are prefixed per scene so scenes never share one. */
export function renderScenes(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(SCENES).map(([name, Scene]) => [name, renderToStaticMarkup(<Scene />, { identifierPrefix: `${name}-` })]),
  )
}
