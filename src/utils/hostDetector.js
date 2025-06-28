const os = require('os');

/**
 * Get the local IP address of the machine
 * @returns {string} The local IP address
 */
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  
  for (const interfaceName in interfaces) {
    const networkInterface = interfaces[interfaceName];
    
    for (const connection of networkInterface) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (connection.family === 'IPv4' && !connection.internal) {
        return connection.address;
      }
    }
  }
  
  return '127.0.0.1'; // Fallback to localhost
};

/**
 * Get all available network addresses
 * @returns {Array} Array of available addresses
 */
const getAllNetworkAddresses = () => {
  const addresses = [];
  const interfaces = os.networkInterfaces();
  
  // Always include localhost
  addresses.push('127.0.0.1');
  addresses.push('localhost');
  
  for (const interfaceName in interfaces) {
    const networkInterface = interfaces[interfaceName];
    
    for (const connection of networkInterface) {
      if (connection.family === 'IPv4' && !connection.internal) {
        addresses.push(connection.address);
      }
    }
  }
  
  return [...new Set(addresses)]; // Remove duplicates
};

/**
 * Get the hostname of the machine
 * @returns {string} The hostname
 */
const getHostname = () => {
  return os.hostname();
};

/**
 * Get platform information
 * @returns {object} Platform information
 */
const getPlatformInfo = () => {
  return {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    type: os.type(),
    release: os.release(),
  };
};

/**
 * Generate server URLs for different environments
 * @param {number} port - The port number
 * @returns {object} Object containing various server URLs
 */
const generateServerUrls = (port) => {
  const localIP = getLocalIPAddress();
  const hostname = getHostname();
  
  return {
    localhost: `http://localhost:${port}`,
    loopback: `http://127.0.0.1:${port}`,
    localNetwork: `http://${localIP}:${port}`,
    hostname: `http://${hostname}:${port}`,
    all: getAllNetworkAddresses().map(addr => `http://${addr}:${port}`)
  };
};

/**
 * Detect if running in a containerized environment
 * @returns {boolean} True if running in a container
 */
const isRunningInContainer = () => {
  try {
    const fs = require('fs');
    
    // Check for Docker container
    if (fs.existsSync('/.dockerenv')) {
      return true;
    }
    
    // Check for other container indicators
    const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8');
    if (cgroup.includes('docker') || cgroup.includes('kubepods') || cgroup.includes('containerd')) {
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Get the appropriate bind address based on environment
 * @returns {string} The bind address
 */
const getBindAddress = () => {
  // If running in container or production, bind to all interfaces
  if (isRunningInContainer() || process.env.NODE_ENV === 'production') {
    return '0.0.0.0';
  }
  
  // For development, bind to localhost by default
  return process.env.HOST || 'localhost';
};

module.exports = {
  getLocalIPAddress,
  getAllNetworkAddresses,
  getHostname,
  getPlatformInfo,
  generateServerUrls,
  isRunningInContainer,
  getBindAddress,
};
