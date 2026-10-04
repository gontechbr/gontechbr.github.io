# Site da GO!

Página única, em português, que apresenta a GO! como empresa de software industrial sob demanda
(integração com o chão de fábrica, gestão da qualidade, rastreabilidade, integração com MES e
ERP, sistemas para a operação) e leva a pessoa para o e-mail de contato.

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
index.html           conteúdo da página
css/styles.css       cores, fontes e layout (cores da marca no começo do arquivo)
js/main.js           e-mail de contato e ano do rodapé
favicon.ico, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
og-image.png         imagem que aparece quando o link é compartilhado
site.webmanifest
_scripts/gerar_icones.py   gera os ícones e a og-image
```

## Configuração

O e-mail de contato fica no começo de `js/main.js`, na constante `CONTACT_EMAIL`. Enquanto estiver
vazia, a página mostra `[PREENCHER: e-mail de contato]` e o console do navegador registra o motivo.

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
