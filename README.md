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

## Abertura

A página inicial mostra a animação do GO! (adaptada do `abertura.js` do SGO) uma vez por visita. A
marca fica no `sessionStorage` (`go-abertura-vista`). Para ver de novo, abra o site numa aba nova ou
rode `sessionStorage.clear()` no console. A pessoa pode pular com o botão "Pular" ou com Esc, e quem
pediu menos movimento no sistema vê o logo parado.

## Configuração

O e-mail de contato fica em `index.html`, na seção `contato`, no link com `data-contact="email"`
(no `href` e no texto). Hoje é guilherme.oliveira@gontech.com.

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
