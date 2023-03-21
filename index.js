const net = require('net');
const fs = require('fs');
const ping = require('ping');
const exec = require('child_process').exec;
const os = require('os');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const responding = [];
const nonResponding = [];
const openPorts = {};

const getLocalIpAddress = () => {
  const ifaces = os.networkInterfaces();
  let ipAddress = '';
  Object.keys(ifaces).forEach((ifname) => {
    let alias = 0;
    ifaces[ifname].forEach((iface) => {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        return;
      }
      if (alias >= 1) {
        console.log(ifname + ':' + alias, iface.address);
      } else {
        console.log(ifname, iface.address);
        ipAddress = iface.address;
      }
      alias++;
    });
  });
  return ipAddress;
};

console.log(`Local IP address: ${getLocalIpAddress()}`);



console.log('Enter the start IP address:');
readline.question('', (startIP) => {
  console.log('Enter the end IP address:');
  readline.question('', (endIP) => {
    console.log('Enter the start port:');
    readline.question('', (startPort) => {
      console.log('Enter the end port(puting in a larg number can cause them not to be writen in the file and console safe numer is 3000):');
      readline.question('', (endPort) => {
        console.log('Starting IP scan...');
        scanPorts(startIP, endIP, startPort, endPort);
        readline.close();
      });
    });
  });
});

const scanPorts = (startIP, endIP, startPort, endPort) => {
  const startOctets = startIP.split('.');
  const endOctets = endIP.split('.');
  const startIPRange = parseInt(startOctets[3]);
  const endIPRange = parseInt(endOctets[3]);

  for (let i = startIPRange; i <= endIPRange; i++) {
    const host = `${startOctets[0]}.${startOctets[1]}.${startOctets[2]}.${i}`;

    ping.promise.probe(host)
      .then(res => {
        if (res.alive) {
          responding.push(`${res.host}: ${res.time} ms`);
          scanOpenPorts(res.host, startPort, endPort);
        } else {
          nonResponding.push(res.host);
        }

        if (responding.length + nonResponding.length === (endIPRange - startIPRange + 1)) {
          printResults();
        }
      });
  }
  console.log('IP scan complet')
  console.log('staring port scan...')
};

const scanOpenPorts = (ip, startPort, endPort) => {
  for (let port = startPort; port <= endPort; port++) {
    const socket = new net.Socket();

    socket.on('error', (err) => {
      socket.destroy();
    });

    socket.on('connect', () => {
      openPorts[ip] = openPorts[ip] || [];
      openPorts[ip].push({ port: port, function: getPortFunction(port) });
      socket.end();
    });

    socket.connect(port, ip);
  }
};

const printResults = () => {
  console.log('port scan complet')
  console.log('clearing files')
  console.log('writing to files')
  console.log(`Number of responding IP addresses: ${responding.length}`);
  fs.writeFileSync('responding.txt', responding.join('\n'));
  fs.writeFileSync('nonResponding.txt', nonResponding.join('\n'));
  fs.writeFileSync('openPorts.json', JSON.stringify(openPorts, null, 2));
  fs.appendFile('log.txt', `scan fait le ${new Date()} nombre de reponce: ${responding.length}\n\n`, (err) => {
    if (err) throw err;
  });
  console.log('scan is done results are in the folwoing files nonResponding.txt, responding.txt and openPorts.json')
  console.log(`these are the responding ip's`, responding)
  console.log(`these are the responding ip's with open ports`, openPorts)
  setTimeout(() => {
    console.log('opening files')
    exec('start responding.txt', (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
    });
    exec('start openPorts.json', (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
    });
  }, 3000)
  setTimeout(() => {
    process.exit()
  }, 10000)
};