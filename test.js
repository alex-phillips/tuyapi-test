const TuyAPI = require('tuyapi')

const device = new TuyAPI({
  ip: 'DEVICE_IP',
  id: 'DEVICE_ID',
  key: 'DEVICE_KEY',
  version: '3.3',
});

const cmd = {
  dps: 25,
  //set: '05464601000003e803e800000000464601007803e803e80000000046460100f003e803e800000000'
  set: '000e0d0000000000000000c80000',
};

let stateHasChanged = false;

// Find device on network
device.find().then(() => {
  // Connect to device
  device.connect();
});

// Add event listeners
device.on('connected', () => {
  console.log('Connected to device!');
  device.set(cmd)
});

device.on('disconnected', () => {
  console.log('Disconnected from device.');
});

device.on('error', error => {
  console.log('Error!', error);
});

device.on('data', data => {
  console.log('Data from device:', data);

  console.log(`Boolean status of default property: ${data.dps['1']}.`);

  // Set default property to opposite
  if (!stateHasChanged) {
    device.set({set: !(data.dps['1'])});

    // Otherwise we'll be stuck in an endless
    // loop of toggling the state.
    stateHasChanged = true;
  }
});

// Disconnect after 10 seconds
setTimeout(() => { device.disconnect(); }, 5000);
