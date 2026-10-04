# Site da GO!

Site institucional da GO!: uma página inicial, em português, que apresenta os produtos prontos
(SGO, GQB e Calibração Guiada) e os projetos sob medida, e uma página para cada produto. Tudo leva
para o e-mail de contato.

## Onde roda e do que depende

- Em produção: GitHub Pages, publicado da branch `main`, pasta raiz. Endereço:
  https://gontechbr.github.io
- Não há build, banco nem servidor. O arquivo `.nojekyll` faz o Pages publicar os arquivos como estão.
- Externo: fonte Unbounded, do Google Fonts, só no logo. O resto do texto usa Arial.

Cores, fontes e regras do logo vêm do repo [go-marca](https://github.com/gontechbr/go-marca).

## Como rodar local

Qualquer servidor estático serve. Com Python:

```
python -m http.server 8000
```

Abra http://localhost:8000.

## Como publicar

Cada push na `main` publica de novo. O Pages leva cerca de um minuto para atualizar.

## Estrutura

```
index.html           página inicial (produtos, sob medida, como atendemos, contato)
sgo/index.html       página do SGO
gqb/index.html       página do GQB
cgo/index.html       página da Calibração Guiada
css/styles.css       cores, fontes e layout do site (cores da marca no começo do arquivo)
css/produto.css      layout das páginas de produto e a cor e as fontes de cada app
js/abertura.js       animação de abertura da página inicial
js/go-demo-engine.js motor das demonstrações animadas (feito no Claude Design)
sgo/demo.html, gqb/demo.html, cgo/demo.html   demonstrações animadas de cada produto
js/main.js           ano do rodapé
assets/produtos/     logos e ícones dos produtos, copiados dos repos de cada app
favicon.ico, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
og-image.png         imagem que aparece quando o link é compartilhado
site.webmanifest
_scripts/gerar_icones.py   gera os ícones e a og-image
```

## Páginas de produto

Cada página usa o cabeçalho e o rodapé do site da GO! e, no miolo, a cor e as fontes do próprio app
(classes `.produto-sgo`, `.produto-gqb` e `.produto-cgo` em `css/produto.css`). As cores e as fontes
vieram do CSS de cada app:

| Produto | De onde veio | Cor de destaque | Fontes |
|---|---|---|---|
| SGO | `C:\sivs\SivsMockup` e `SGO-marca.zip` | `#0A9E64` | Barlow Condensed e Hanken Grotesk |
| GQB | `C:\ParqueDeBalancas` | `#1F5F99` | Bahnschrift (Barlow Semi Condensed fora do Windows) e Segoe UI |
| Calibração Guiada | `C:\CalibracaoGuiadaApp` | `#E8590C` | Bahnschrift (Barlow Semi Condensed fora do Windows) e Segoe UI |

As telas no topo de cada página são ilustrações em HTML e CSS, não capturas. Os textos e números
nelas são de exemplo e a legenda diz isso. Os textos das funções foram tirados do código e do README
de cada app: só entra o que já tem tela. Ao mudar um app, revise a página dele.

## Demonstrações animadas

Cada página de produto tem, logo abaixo do topo, a faixa "Veja o ... em uso" com a demonstração
animada do app num iframe (`demo.html` na pasta do produto). As animações foram feitas no Claude
Design (projeto com `Demo SGO.dc.html`, `Demo GQB.dc.html` e `Demo CGO.dc.html`) a partir dos roteiros
em `C:	emp\Go\claude-design\`. Aqui elas foram só convertidas para HTML puro: saiu o runtime de
componentes do Claude Design (que depende de React) e o quadro chama `js/go-demo-engine.js` direto.
Marcação, cores e tempos são os do Claude Design. Para mudar a animação, mude lá e converta de novo.

- A própria demonstração tem o botão "Pausar" e, para quem pede menos movimento no sistema, mostra uma
  cena parada.
- `js/main.js` manda `{ goDemo: 'pause' }` para o iframe quando ele sai da tela e `{ goDemo: 'play' }`
  quando volta. Se a pessoa pausou pelo botão, a página não retoma.
- A demonstração roda em 800 x 520 e `js/main.js` amplia o iframe para ocupar a faixa (até 1.400 px de
  largura e 85% da altura da janela). Em tela com menos de 760 px, não amplia. Abaixo de uns 460 px, as
  folhas que sobem do rodapé da demonstração (como "Agendar visita" no SGO) ficam cortadas.

## Logos do GQB e do CGO

Os dois agora são só letra, como na prancha do Claude Design: Barlow Condensed ExtraBold, com o Q do
GQB em âmbar `#E8A317` e o G do CGO em laranja `#E8601C`. Os SVGs em `assets/produtos/` (`gqb-icone.svg`,
`cgo-icone.svg`, `gqb-fundo-escuro.svg`, `cgo-fundo-escuro.svg`) foram gerados em curvas a partir da
fonte, então não dependem dela carregar.

## Abertura

A página inicial mostra a animação do GO! (adaptada do `abertura.js` do SGO) uma vez por visita. A
marca fica no `sessionStorage` (`go-abertura-vista`). Para ver de novo, abra o site numa aba nova ou
rode `sessionStorage.clear()` no console. A pessoa pode pular com o botão "Pular" ou com Esc, e quem
pediu menos movimento no sistema vê o logo parado.

## Configuração

O e-mail de contato fica em `index.html`, na seção `contato`, no link com `data-contact="email"`
(no `href` e no texto). Hoje é guilherme.oliveira@gontech.com.

O WhatsApp de contato fica no rodapé das quatro páginas (`index.html`, `sgo/`, `gqb/` e `cgo/`), no
link com a classe `footer-whatsapp`: o número aparece no texto e vai no `href` como
`https://wa.me/5519996887198`. Para trocar, mude nos quatro arquivos.

## Como gerar os ícones de novo

Os ícones são desenhados com a Unbounded ExtraBold, seguindo as regras do logo (quadrado grafite com
raio de 22%, "GO" claro, "!" verde, variante "G!" em 16 px). O script precisa de Pillow e da fonte em
peso 800, que sai do arquivo variável do Google Fonts:

```
pip install pillow fonttools
curl -L -o Unbounded.ttf "https://github.com/google/fonts/raw/main/ofl/unbounded/Unbounded%5Bwght%5D.ttf"
python -c "from fontTools.ttLib import TTFont; from fontTools.varLib.instancer import instantiateVariableFont as i; i(TTFont('Unbounded.ttf'), {'wght': 800}).save('Unbounded-ExtraBold.ttf')"
python _scripts/gerar_icones.py Unbounded-ExtraBold.ttf
```

Os arquivos `.ttf` ficam fora do Git (`.gitignore`).
