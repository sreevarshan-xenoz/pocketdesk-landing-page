import { SectionHead } from '../components/SectionHead'
import { REPO } from '../lib/release'
import s from './Faq.module.css'

const QUESTIONS: Array<{ q: string; a: string }> = [
  {
    q: 'Is it really free?',
    a: 'Yes. Pocketdesk is open source under MIT or Apache-2.0, with no paid tier, no ads and no account.',
  },
  {
    q: 'Does my screen go through your servers?',
    a: "There are no Pocketdesk servers. At home the phone talks to the computer directly. Away from home, iroh finds a direct path, and when it can't, a relay carries the encrypted traffic: it sees which addresses talk and how much, never what. You can run your own relay.",
  },
  {
    q: 'Do I have to set up my router?',
    a: 'No. After one session at home (or through Tailscale), the phone reaches the computer from anywhere with no port forward. Only waking a sleeping computer from outside needs one, or another always-on computer at home.',
  },
  {
    q: 'What if the Wi-Fi goes down?',
    a: 'Between a Windows computer and the Android phone bonded with it, the clipboard, notifications, the remote and small files keep going over Bluetooth while the two are in range. The screen comes along too, at a lower quality (about 480 lines, 15 frames a second), and a file waits while it runs. It is on by default and new, not yet checked on a phone.',
  },
  {
    q: 'Which phones and computers does it run on?',
    a: 'Android 8 and newer for the phone. Windows 10 and 11, and Linux on Wayland (Hyprland, Sway, GNOME, KDE) or X11, for the computer, and a Wear OS tile for the watch. macOS and iPhone are not supported.',
  },
  {
    q: 'Can my computers use it with each other?',
    a: 'Yes. Pair two of your computers both ways and they share one keyboard and mouse, show each other’s screens in a window, and hand windows across. Your phone can pair with all of them in the same step.',
  },
  {
    q: 'Does it need a graphics card?',
    a: "It uses your GPU's video encoder when there is one (NVENC, AMF, Quick Sync or VAAPI) and falls back to software encoding when there isn't.",
  },
  {
    q: 'Can someone else take over my computer?',
    a: 'Only a phone you paired, and only with the permissions you gave it. Pairing checks each side’s certificate, and you can have the computer ask before every session.',
  },
  {
    q: 'Is it finished?',
    a: 'It is in beta. It runs on real phones and computers, and the README lists exactly what has been checked on which device, and what has not yet.',
  },
]

export function Faq() {
  return (
    <section id="faq" className={s.section} aria-labelledby="faq-title">
      <div className={s.inner}>
        <SectionHead label="Questions" id="faq-title" size="md" title="Good to know." />
        <div className={s.list}>
          {QUESTIONS.map((item) => (
            <details key={item.q} className={s.item}>
              <summary>
                {item.q}
                <span className={s.plus} aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
          <p className={s.more}>
            Something else? <a href={`${REPO}/issues`}>Ask on GitHub</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
