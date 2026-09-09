const fs = require('fs');
const path = require('path');

const policiesDir = path.join(__dirname, '../views/pages/policies');

module.exports = {
  quemSomos: {
    title: 'Conheça a Country Style',
    file: path.join(policiesDir, 'quem-somos.html'),
    defaultContent: `
      <p>A <strong>Country Style</strong> nasceu em Pilar do Sul (SP), coração do universo country. Oferecemos moda autêntica e acessível para quem vive o campo e o rodeio, com entrega para todo o Brasil e loja física.</p>
      <h2>Nossa missão</h2>
      <p>Levar a moda country de qualidade até você, com preços justos, atendimento próximo de verdade e envio expresso para todo o Brasil.</p>
      <h2>O que você encontra aqui</h2>
      <ul>
        <li>Botas e calçados femininos e masculinos</li>
        <li>Calças, camisas e blusas western</li>
        <li>Chapéus, bonés e acessórios</li>
        <li>Kits promocionais exclusivos</li>
      </ul>
      <p>Visite nossa loja física em Pilar do Sul - SP ou compre online com segurança.</p>
    `
  },
  privacidade: {
    title: 'Políticas de Privacidade',
    file: path.join(policiesDir, 'politica-de-privacidade.html'),
    defaultContent: `
      <p>A <strong>Country Style Modas Ltda</strong> valoriza a privacidade dos seus clientes e está comprometida em proteger as informações pessoais coletadas durante a navegação e compra em nosso site.</p>
      <h2>1. Dados coletados</h2>
      <ul>
        <li>Dados pessoais: nome completo, CPF, telefone, e-mail e endereço de entrega.</li>
        <li>Dados de pagamento: processados de forma criptografada pelo gateway de pagamento. Não armazenamos dados de cartão de crédito.</li>
        <li>Dados de navegação: endereço IP, cookies e histórico de compras para melhorar a experiência do usuário.</li>
      </ul>
      <h2>2. Uso das informações</h2>
      <p>Utilizamos seus dados para processar pedidos, enviar atualizações sobre compras, realizar entregas, prestar atendimento ao cliente e enviar comunicações de marketing (quando autorizado).</p>
      <h2>3. Compartilhamento de dados</h2>
      <p>Seus dados podem ser compartilhados com transportadoras, gateways de pagamento e autoridades competentes quando exigido por lei.</p>
      <h2>4. Segurança</h2>
      <p>Adotamos medidas técnicas e administrativas para proteger suas informações contra acesso não autorizado, perda ou vazamento.</p>
      <h2>5. Seus direitos</h2>
      <p>Você pode solicitar acesso, correção, exclusão ou portabilidade dos seus dados a qualquer momento pelo e-mail contato@countrystyle.com.br.</p>
    `
  },
  trocas: {
    title: 'Trocas e Devoluções',
    file: path.join(policiesDir, 'politica-de-trocas-e-devolucoes.html'),
    defaultContent: `
      <p>Você pode solicitar troca ou devolução em até 7 dias corridos após o recebimento do produto, conforme o Código de Defesa do Consumidor.</p>
      <h2>1. Condições para troca/devolução</h2>
      <ul>
        <li>O produto deve estar sem sinais de uso.</li>
        <li>Deve conter etiquetas e embalagem originais.</li>
        <li>É necessário apresentar nota fiscal ou comprovante de compra.</li>
      </ul>
      <h2>2. Como solicitar</h2>
      <p>Envie um e-mail para contato@countrystyle.com.br ou chame no WhatsApp (15) 99790-2393 com o número do pedido, fotos do produto e motivo da solicitação.</p>
      <h2>3. Procedimentos</h2>
      <p>Após análise, enviaremos as instruções para postagem. O prazo para análise é de até 7 dias úteis após o recebimento do produto em nosso centro de distribuição.</p>
      <h2>4. Reembolso</h2>
      <p>Em caso de devolução aprovada, o reembolso será processado na mesma forma de pagamento utilizada na compra, em até 10 dias úteis.</p>
    `
  },
  envio: {
    title: 'Política de Envios',
    file: path.join(policiesDir, 'politica-de-envio.html'),
    defaultContent: `
      <p>A <strong>Country Style</strong> realiza entregas para todo o território nacional.</p>
      <h2>1. Prazo de postagem</h2>
      <p>Os pedidos são postados em até 3 dias úteis após a confirmação do pagamento, exceto em feriados e eventos de alta demanda.</p>
      <h2>2. Prazo de entrega</h2>
      <p>O prazo de entrega varia de acordo com o destino e a modalidade de envio selecionada. O prazo estimado é informado no momento da compra.</p>
      <h2>3. Envio expresso</h2>
      <p>Trabalhamos com envio expresso para todo o Brasil. Consulte o prazo e o valor do frete no checkout.</p>
      <h2>4. Rastreamento</h2>
      <p>Após a postagem, o código de rastreamento será enviado por e-mail ou WhatsApp.</p>
    `
  },
  pagamentos: {
    title: 'Pagamentos',
    file: path.join(policiesDir, 'pagamentos.html'),
    defaultContent: `
      <p>A <strong>Country Style</strong> oferece um processo de pagamento seguro através de gateway parceiro.</p>
      <h2>1. Formas de pagamento</h2>
      <p>Aceitamos cartão de crédito (Visa, Mastercard, Elo, American Express, Hipercard) e Pix. Pague no Pix e ganhe <strong>10% de desconto</strong>.</p>
      <h2>2. Parcelamento</h2>
      <p>Parcele no cartão em até <strong>10x SEM JUROS</strong> (parcela mínima de R$ 50,00).</p>
      <h2>3. Segurança</h2>
      <p>As transações são processadas com criptografia SSL e seguem os padrões de segurança do mercado de pagamentos.</p>
      <h2>4. Confirmação</h2>
      <p>O pedido será processado após a confirmação do pagamento. Pedidos pagos por Pix podem levar até 2 dias úteis para compensação.</p>
    `
  },
  garantia: {
    title: 'Garantia dos Produtos',
    file: path.join(policiesDir, 'politica-de-garantia.html'),
    defaultContent: `
      <p>Todos os produtos da <strong>Country Style</strong> possuem garantia contra defeitos de fabricação.</p>
      <h2>1. Prazo de garantia</h2>
      <p>O prazo de garantia é de 90 dias para defeitos de fabricação, conforme o Código de Defesa do Consumidor.</p>
      <h2>2. O que cobre</h2>
      <ul>
        <li>Defeitos de costura, colagem ou material;</li>
        <li>Peças com avaria de fabricação;</li>
        <li>Produto recebido em desacordo com o pedido.</li>
      </ul>
      <h2>3. Como acionar</h2>
      <p>Entre em contato pelo e-mail contato@countrystyle.com.br ou WhatsApp (15) 99790-2393 com fotos do produto e número do pedido.</p>
    `
  },
  cancelamentos: {
    title: 'Cancelamentos',
    file: path.join(policiesDir, 'cancelamentos.html'),
    defaultContent: `
      <h2>1. Antes do envio</h2>
      <p>O cancelamento pode ser solicitado sem custo antes da postagem do pedido, pelo WhatsApp (15) 99790-2393 ou e-mail contato@countrystyle.com.br.</p>
      <h2>2. Após o envio</h2>
      <p>Após a postagem, você pode recusar o pedido na entrega ou solicitar devolução conforme nossa política de Trocas e Devoluções.</p>
      <h2>3. Reembolso</h2>
      <p>Pedidos cancelados e pagos via Pix serão reembolsados na mesma conta informada no pagamento. Pedidos no cartão terão estorno junto à operadora.</p>
    `
  },
  rastreio: {
    title: 'Rastreio',
    file: path.join(policiesDir, 'rastreio.html'),
    defaultContent: `
      <h2>Rastreie seu pedido</h2>
      <p>Assim que seu pedido for postado, o código de rastreamento será enviado automaticamente para o e-mail e WhatsApp informados na compra.</p>
      <h2>Onde acompanhar</h2>
      <ul>
        <li>Pelo link recebido no e-mail/WhatsApp de confirmação de envio;</li>
        <li>No site dos Correios: <a href="https://rastreamento.correios.com.br/" target="_blank" rel="noopener">rastreamento.correios.com.br</a>;</li>
        <li>Ou fale com o nosso atendimento pelo WhatsApp (15) 99790-2393 com o número do pedido.</li>
      </ul>
      <p>Os pedidos são postados em até 3 dias úteis após a confirmação do pagamento.</p>
    `
  },
  perguntas: {
    title: 'Perguntas Frequentes',
    file: path.join(policiesDir, 'perguntas-frequentes.html'),
    defaultContent: `
      <h2>Qual o prazo de entrega?</h2>
      <p>Postamos em até 3 dias úteis após a confirmação do pagamento. O prazo de entrega varia conforme o destino e é informado no checkout.</p>
      <h2>Como pago no Pix e ganho desconto?</h2>
      <p>Escolha o Pix no checkout: o desconto de 10% é aplicado automaticamente no valor exibido.</p>
      <h2>Posso parcelar?</h2>
      <p>Sim! Parcele no cartão em até 10x sem juros (parcela mínima de R$ 50,00).</p>
      <h2>Como falo com o atendimento?</h2>
      <p>Pelo WhatsApp (15) 99790-2393, de segunda a sexta das 9h às 18h e sábado das 9h às 17h.</p>
      <h2>Vocês têm loja física?</h2>
      <p>Sim! Estamos na Rua Zulmira De Almeida Carvalho, Nº 20, Jd. Campestre, Pilar do Sul - SP.</p>
    `
  }
};

if (!fs.existsSync(policiesDir)) fs.mkdirSync(policiesDir, { recursive: true });

for (const key in module.exports) {
  const p = module.exports[key];
  if (!fs.existsSync(p.file)) {
    fs.writeFileSync(p.file, p.defaultContent.trim());
  }
}
