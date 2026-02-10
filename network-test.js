const dns = require('dns');
const net = require('net');

const host = 'db.uomvkfoebrjqshngoiib.supabase.co';
const port = 5432;

console.log(`Diagnóstico de Rede para ${host}:${port}`);

// 1. Teste de DNS
console.log('1. Testando resolução de DNS...');
dns.lookup(host, (err, address, family) => {
  if (err) {
    console.error('❌ Falha no DNS:', err.message);
    return;
  }
  console.log(`✅ DNS Resolvido: ${address} (IPv${family})`);

  // 2. Teste de Conexão TCP
  console.log(`2. Testando conexão TCP com ${address}:${port}...`);
  const socket = new net.Socket();
  socket.setTimeout(5000); // 5 segundos de timeout

  socket.on('connect', () => {
    console.log('✅ Conexão TCP estabelecida com sucesso!');
    socket.destroy();
  });

  socket.on('timeout', () => {
    console.error('❌ Timeout na conexão TCP (Firewall ou Rede lenta)');
    socket.destroy();
  });

  socket.on('error', (err) => {
    console.error('❌ Erro na conexão TCP:', err.message);
  });

  socket.connect(port, address);
});
