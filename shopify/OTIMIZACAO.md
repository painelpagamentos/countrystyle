# Tema Yuna Bella, versão otimizada

Base: `theme_export__yunabella-com-yuna-bella__28JUL2026-0401pm.zip`
Trabalho feito em cópia local. A loja em produção não foi tocada em nenhum momento.

---

## Antes de subir, leia isto

**Nunca edite o tema publicado.** Suba este tema como **cópia não publicada**, teste, e só então publique.

1. Admin Shopify, Loja virtual, Temas, Adicionar tema, Fazer upload do arquivo zip.
2. Ele entra como tema **não publicado**. Clique em **Visualizar**.
3. Rode o checklist de teste abaixo dentro do preview.
4. Só depois: Publicar.

Se algo der errado depois de publicar, o tema antigo continua na lista. Republicar leva 10 segundos.

### Checklist de teste no preview

- [ ] Home carrega, banner e coleções aparecem
- [ ] Página de produto: foto principal aparece (não fica invisível nem em branco)
- [ ] Zoom da foto funciona ao clicar
- [ ] Trocar variante (tamanho ou cor) atualiza preço, parcelamento e PIX
- [ ] Preço PIX aparece com valor real, não R$ 0,00
- [ ] Botão "Adicionar ao carrinho" mostra o ícone de sacola, não um quadradinho
- [ ] Adicionar ao carrinho leva ao carrinho com **1 unidade**
- [ ] "Finalizar Compra" leva para `pagamento.yunabella.com` (checkout Corvex)
- [ ] Página de contato mostra os campos nome, e-mail e mensagem
- [ ] No celular: botão flutuante de compra funciona
- [ ] Barra de escassez aparece no topo da página de produto (foi mantida a pedido seu)
- [ ] Link "Rastreie seu pedido" no cabeçalho leva ao pacseguro.com
- [ ] Gerenciador de Eventos, Testar eventos: PageView, ViewContent, AddToCart e **InitiateCheckout** aparecem

O InitiateCheckout é o mais importante: ele estava sendo descartado e agora deve voltar.

---

## As cinco decisões

Você mandou fazer completo sem responder as perguntas, então segui pelo caminho mais defensável e depois revisou duas. Estado final abaixo.

**1. Escassez: mantida como estava no tema original.** (decisão sua)
Eu havia removido; você mandou reverter e está revertido. O `sections/product-template.liquid` está byte a byte igual ao original, e o cronômetro voltou a exibir "QUEIMA TOTAL: ÚLTIMAS 12 UNIDADES".
Registro do que o tema faz, para você ter em mãos se a conta for revisada: o contador começa em 9, desce até 4 via `setInterval`, é igual em todo produto e não lê `inventory_quantity`.
*Se um dia quiser trocar por estoque real, sem código:* Personalizar, ative "Show inventory" e ajuste "Low inventory threshold".

**2. Calculadora de frete: mantida como está, ainda sem retornar opções.**
Não inventei valores de frete. As chaves `active_free_ship` e `active_paid_ship` continuam desligadas, então a calculadora segue sem devolver nada. **Isto continua sendo um problema de conversão** e depende de você.
*Para resolver:* Personalizar, Calculadora de frete, preencher nome, prazo e preço reais e ligar as duas chaves. Ou me diga os valores que eu configuro.

**3. Link de rastreio: apontando para `pacseguro.com`.** (decisão sua)
Continua indo para lá, como você pediu. A única mudança que ficou é de robustez: o item agora está dentro de um `{% if %}`, então se um dia você esvaziar a URL em Personalizar, Cabeçalho, ele some em vez de virar link quebrado. Com a URL preenchida, o comportamento é o mesmo de antes.

**4. GA4: não instalei.**
Precisa do Measurement ID, que eu não tenho. Hoje sua medição inteira depende de um ponto único (UTMify). Me passe o ID que eu ponho.

**5. jQuery: conservador.**
13 arquivos `.liquid` e o `custom.js` usam `$()` em scripts inline que rodam durante o parse. Com `defer`, todos quebrariam. Mantive síncrono, mas troquei o CDN `code.jquery.com` pelo `jquery.js` local (3.7.1, que já existia no tema sem uso). Tira uma origem externa do caminho crítico sem risco.

---

## O que mudou, por lote

Cada lote é um commit. Para ver qualquer um: `git show <sha>` dentro de `~/dev/YUNABELLA/yunabella-theme`.

### Lote 1: código morto e o checkout de outra loja

O `theme.liquid` caiu de 392 para 225 linhas.

| Removido | Por quê |
|---|---|
| Blocos `foxScriptUtm` e `foxScriptCart` (133 linhas) | Reescreviam o formulário do carrinho para `pay.oliviadelicata.shop`, domínio **não registrado e livre para qualquer um comprar**. Era o achado mais grave da auditoria |
| `snippets/icon-social.liquid` | Apesar do nome, era o stub de `fbq` que descartava InitiateCheckout, AddPaymentInfo e Purchase, mais o `noscript` que escondia o site e redirecionava para `imadigital.com.br` |
| Bloqueio de F12 e botão direito (58 linhas) | Desativava também a seleção de texto: o cliente não copiava cupom, e-mail do SAC nem código de rastreio |
| `content_for_header` duplicado e `snippets/content_for_header.liquid` | Cópia adulterada que reemitia scripts inline do Shopify e deixava outros mortos |
| 4 `@import` de Google Fonts | Nenhuma era usada; a tipografia vem do seletor de fonte do Shopify |
| Font Awesome (CSS inteiro do CDN) | 14 KB bloqueantes mais a webfont, para 2 ícones. E a família pedida no CSS ("Font Awesome 5 Free") nem existia na versão 6 carregada, então o ícone do botão de compra era um quadradinho |
| `render 'Corvex'` de 19 templates | Estava no layout **e** em cada template, então o `redirect.js` era baixado e executado duas vezes por página |
| `if` que renderizava `product-infoqtd` | Snippet que não existe. Qualquer edição na condição derrubaria o formulário de compra inteiro |

Também: `lang="pt-BR"` no `<html>` e `<meta charset>` no topo.

### Lote 2 e 3: tracking, escassez e identidade

**Tracking**
- Os dois carregadores ofuscados (base64 mais XOR) viraram scripts legíveis da UTMify, com `preconnect`.
- JSON-LD: `sku` agora sempre presente, com fallback para `variant.id`, mais `productID` explícito. É o identificador que o feed do canal Facebook usa (`shopify_BR_{product}_{variant}`), então a página passa a casar com o item do catálogo. Sem isso, catálogo dinâmico não funciona.
- `productId` virou `productID`, que é a propriedade válida do schema.org.

**Escassez**: mantida como no original, a seu pedido (ver decisão 1).

**Identidade de terceiros** (todas confirmadas ao vivo no site antes da correção)
- Caixa de frete da página de produto: "Olivia Delicata" virou "Yuna Bella".
- Selos do rodapé: verificavam o SSL de `zuban.com.br`, agora apontam para `yunabella.com`.
- Selo "certificada pela Ímã Digital", do vendedor do tema: desligado.
- Página de contato: campos de nome, e-mail e mensagem restaurados; removido o botão que mandava o cliente para `atlasexpress.site`.

**Conversão**
- `evolution-payments` recebia `current_variant` mas lia `selected_variant`, então o HTML vinha com "R$ 0,00 no pix" até o JavaScript corrigir. Resolvido.
- Home passou a anunciar 10% no PIX, que é o praticado na página e no checkout. Estava anunciando 5%.
- `featured-product`: botão de pagamento dinâmico desligado. Se alguém arrastasse esse bloco para a home, nasceria um botão Shop Pay indo direto ao checkout do Shopify, fora da Corvex.
- Os 3 ícones que dependiam do Font Awesome viraram SVG inline.

### Lote 4: performance

- **LCP**: a foto principal do produto agora usa `src` e `srcset` nativos, com `fetchpriority="high"`. Antes ela só começava a baixar depois de 395 KB de JavaScript.
- Removido um `IntersectionObserver` que varria todas as imagens procurando a classe `lazy`. O tema usa `lazyload`, e `contains('lazy')` nunca casa: era no-op puro.
- Removido um `setInterval` de 100 ms na página de produto procurando `.audited`, classe que não existe (só existe `review-audited`). Rodava para sempre sem fazer nada.
- `ad-banner`: guarda em volta de `simplyScroll()`, função que não existe em nenhum asset e cujo erro abortava o resto do callback.

Duas armadilhas que apareceram durante o trabalho e foram resolvidas:
1. Manter `class="lazyload"` junto de `src` faria o navegador baixar a foto **duas vezes**.
2. Tirar só o `lazyload` deixaria a foto **invisível**, porque `.image--fade-in` tem `opacity: 0` e só vira 1 com a classe que o lazysizes adiciona.

Por isso a imagem principal sai do lazysizes por completo. O zoom continua funcionando: depende do seletor e dos atributos `data-zoom`, preservados.

---

## O que continua pendente e depende de você

Nada disto está no tema. São itens de painel, e é onde mora o risco de conta.

**Prioridade alta**

1. **Políticas da loja.** Só existe a de privacidade. Faltam reembolso, trocas, envio e termos, e nenhuma está linkada no rodapé. Configurações, Políticas.
2. **CNPJ e razão social no rodapé.** Hoje só tem endereço, e é o mesmo endereço que o tema atribuía à Olivia Delicata.
3. **Calculadora de frete.** Decidir entre preencher com dados reais ou tirar da página.
4. **Tabela de parcelamento da Corvex.** O tema mostra 12x com 19,8% de juros embutido. Confirme que a Corvex cobra o mesmo, senão o cliente vê um valor na página e outro ao pagar. Vale também exibir o total e a taxa, que o CDC exige.

**Prioridade média**

5. **Menu do cabeçalho** está vazio na configuração.
6. **`/collections`** ainda lista coleções de eletrônicos, fones e pets.
7. **Dynamic Checkout**: desligar em Configurações, Checkout (cinto e suspensório com o item do `featured-product`).
8. **Corvex**: cobrar hospedagem do `redirect.js` em domínio próprio com versão fixa. Hoje ele vem de um Netlify anônimo sem verificação de integridade, e todo o seu fluxo de compra depende dele.
9. **Bloco de links vazio no rodapé** renderiza uma coluna fantasma.

---

## Depois de publicar

Confira no Gerenciador de Eventos, por 24 horas:

- **InitiateCheckout voltou a aparecer.** Era o principal evento perdido.
- **Purchase não duplicou.** Ele já vinha pelo servidor da UTMify. Se agora aparecer em dobro, é dedup por `event_id` para ajustar, me chame.
- **Qualidade da correspondência** não caiu.

Se o InitiateCheckout não voltar, o filtro não era a única causa e vale investigar a integração da UTMify com o checkout.

---

## Lote 5: o que tinha ficado para trás

Você perguntou se estava 100%. Não estava. Fiz uma varredura cruzando os achados da auditoria com o tema e encontrei itens que eu tinha classificado como críticos e não havia removido. Corrigidos agora:

- **Três scripts de duas outras lojas Shopify** (`title_description.js` da loja 0565/5658/5007 e os `globo_checkout` da 0603/7530/2276). Eram render-blocking e vinham do CDN de lojas alheias.
- **Watermark de 99999x99999** injetado dentro do `<head>`: HTML inválido e overlay de 96vw por 96vh em toda página.
- **Geo-IP `wtfismyip.com`** no bloco de frete: enviava o IP do visitante para serviço gratuito de terceiro. Agora usa o dado que o próprio Shopify já resolve.
- **`progressbar.liquid` deletado**: estava dentro de um comentário HTML, mas o Liquid renderiza antes do navegador, então ainda puxava jQuery 1.9.1 do googleapis e montava escassez **aleatória** (19 a 45 unidades).
- **`jquery.mask`** passou do cdnjs para asset local. Última origem externa evitável do layout.
- **Bug de preço no "Compre junto"**: "R$ 1.299,90" virava 1.299, então o total saía errado acima de mil reais.
- **Cronômetro** parava de reiniciar infinitamente.
- **Cupom do popup** deixou de ser fixo "PRIMEIRACOMPRA" e passou a usar o campo do editor (a barra anuncia "PRIMEIRA10").
- **`og:image`** de http para https: preview de link em WhatsApp e Meta exige https.
- **Bloco de links vazio** no rodapé desativado (renderizava coluna fantasma).

### Origens externas no layout

| Antes | Depois |
|---|---|
| cdn.shopify.com | cdn.shopify.com |
| fonts.shopifycdn.com | fonts.shopifycdn.com |
| code.jquery.com | (asset local) |
| cdnjs.cloudflare.com (Font Awesome) | (removido) |
| cdnjs.cloudflare.com (jquery.mask) | (asset local) |
| fonts.googleapis.com (4 famílias) | (removido) |
| pay.oliviadelicata.shop | (removido) |
| | cdn.utmify.com.br |
| | connect.facebook.net |

---

## O que conscientemente NÃO foi feito

Para você saber exatamente onde o trabalho parou.

**Fora do alcance de um tema**
- `redirect.js` da Corvex continua vindo de um Netlify anônimo, sem verificação de integridade. É do fornecedor; só resolve cobrando deles.
- Widget de avaliações (`areviewsapp`) sem SRI. É app instalado, não código do tema.

**Exigiria reescrever o tema (risco alto, ganho incerto)**
- `theme.min.js` (395 KB) e `theme.css` (282 KB) continuam monolíticos, carregados inteiros em toda página.
- CSS e JS inline grandes por página (footer 61 KB, header 46 KB, product-info 44 KB). Mover para assets cacheáveis é uma refatoração, não um ajuste.
- LCP: otimizei a página de produto. A home (slideshow) e a listagem de coleção continuam dependendo do lazysizes.

**Higiene que não mexe em runtime (deixei para não aumentar superfície de risco)**
- 15 sections sem referência, 5 idiomas sem uso, `product.contact.liquid` idêntico a `product.pre-order.liquid`, 2 assets órfãos de 4 KB.
- Blocos dormentes que exibem estoque como se fossem vendas (`delivered-orders`, `quantitysell`). Estão desligados; se alguém ligar, o número mostrado é matematicamente errado.
- Badges de app store de 366 KB: estão em bloco desativado, então não carregam hoje.

**Melhorias de SEO não feitas**
- Sem `aggregateRating` no JSON-LD (nenhuma estrela no resultado de busca), sem `Organization` e sem `WebSite`.
- Breadcrumb de artigo repete o nome do blog na terceira posição.

**Depende de você (painel, não tema)**
- Políticas de reembolso, trocas, envio e termos; CNPJ e razão social; calculadora de frete com valores reais; conferir a tabela de parcelamento na Corvex; menu do cabeçalho vazio; coleções de outro nicho em `/collections`; desativar Dynamic Checkout.
