const nodecastor = require("nodecastor");
const { Client } = require("castv2-client");
const { DefaultMediaReceiver } = require("castv2-client");
const ping = require("ping");

const device = {
    "device_ip": "192.168.0.64",
    "device_name": "1",
    "url": "https://aidtaas.com/products/customer-data-platform",
    "isStop": false
};


const roundToNearest = (number, decimalPlaces) => {
    const factor = Math.pow(10, decimalPlaces);
    return (Math.round(number * factor) / factor).toFixed(decimalPlaces);
  }

const calculateScaleParams = (x1, x2, y1, y2) => {
    
    var x2 = parseFloat(x2) / 100;
    var x1 = parseFloat(x1) / 100;
    var y1 = parseFloat(y1) / 100;
    var y2 = parseFloat(y2) / 100;
    
    var minusX = x2 - x1;
    var scalex = 1 / minusX;
    var scalexMinus = scalex - 1;
    if (scalexMinus === 0) {
      scalexMinus = 1;
    }

    var minusY = y2 - y1;
    var scaley = 1 / minusY;
    var scaleyMinus = scaley - 1;
    if (scaleyMinus === 0) {
      scaleyMinus = 1;
    }

    var originx = ((scalex * x1) / scalexMinus) * 100;
    var originy = ((scaley * y1) / scaleyMinus) * 100;
    scalex = roundToNearest(scalex, 2);
    scaley = roundToNearest(scaley, 2);
    originx = roundToNearest(originx, 2);
    originy = roundToNearest(originy, 2);

    console.log(
      "scalex : ",
      scalex,
      " scaley : ",
      scaley,
      " originx ; ",
      originx,
      " originy : ",
      originy
    );
    return { scalex, scaley, originx, originy };
};

const startCasting = async (device) => {
    try {
        const { device_name, device_ip, url, x1, x2, y1, y2 } = device;
        console.log("Casting to device:", device_name);

        const res = await ping.promise.probe(device_ip);
        console.log("alive : ", res.alive);
        if (!res.alive) return ("Device not found on network");

        let scaleFactorParams = "";
        if (x1 && x2 && y1 && y2) {
            const scaleParams = calculateScaleParams(x1, x2, y1, y2);
            scaleFactorParams = `&scalex=${scaleParams.scalex}&scaley=${scaleParams.scaley}&originx=${scaleParams.originx}&originy=${scaleParams.originy}&rotate=0`;
        }

        let finalUrl = url;
        console.log("final url :", finalUrl);

        const deviceObject = new nodecastor.CastDevice({
            friendlyName: device_name,
            name: device_name,
            address: device_ip,
        });

        await new Promise((resolve, reject) => {
            deviceObject.on("connect", () => {
                deviceObject.status((err, status) => {
                    if (err) {
                        console.error("Device status error:", err);
                        reject(err);
                        return;
                    }
                    console.log("Device status done");
                    if (device.device && device.device.casterId) {
                        sendDeviceStatus({ casterId: device.device.casterId, chromecastId: device.host, timestamp: Date.now(), state: "success" });
                    }

                    try {
                        deviceObject.application("5CB45E5A", (err, application) => {
                            if (err) {
                                console.error("Application error:", err);
                                reject(err);
                                return;
                            }
                            application.run("urn:x-cast:com.url.cast", (err, session) => {
                                if (err) {
                                    console.error("Run error:", err);
                                    reject(err);
                                    return;
                                }
                                session.send({ type: "loc", url: finalUrl }, (err, data) => {
                                    if (err) {
                                        console.error("Send error:", err);
                                        reject(err);
                                        return;
                                    }
                                    console.log("Casting success to device:", device_name);
                                    resolve();
                                });
                            });
                        });
                    } catch (error) {
                        console.error("Casting error:", error);
                        reject(error);
                    }
                });
            });
        });

        return "casting done";
    } catch (error) {
        console.error("Error in casting:", error);
    }
};

const stopCasting = async (device) => {
    console.log("Stopping casting");
    try {
        const { device_ip } = device;

        const resu = await ping.promise.probe(device_ip);
        console.log("alive : ", resu.alive);
        if (!resu.alive) return res.send("Device not found on network");

        const client = new Client();
        await new Promise((resolve, reject) => {
            client.connect(device_ip, () => {
                client.launch(DefaultMediaReceiver, (err) => {
                    if (err) {
                        console.error("Launch error:", err);
                        reject(err);
                        return;
                    }
                    console.log("Stopped casting to device:", device.device_name);
                    client.close();
                    resolve();
                });
            });
            client.on("error", (err) => {
                console.error("Error occurred for stopping the casting:", err);
                reject(err);
            });
        });
    } catch (error) {
        console.error("Stop casting error:", error);
    }
};

async function main() {
    await stopCasting(device)
    const status = await startCasting(device);
    console.log("Status : ", status);
}

main()