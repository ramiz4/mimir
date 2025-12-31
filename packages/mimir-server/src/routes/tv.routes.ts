import { Router } from 'express';
import { TVController } from '../controllers/tv.controller.js';

const router: Router = Router();

/**
 * @openapi
 * /api/devices:
 * @openapi
 * /api/devices:
 *   get:
 *     summary: List all discovered TVs
 *     description: Returns an array of all TVs currently discovered in the network.
 *     responses:
 *       200:
 *         description: Successful query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ip:
 *                     type: string
 *                   name:
 *                     type: string
 *                   model:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   commands:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get('/devices', TVController.getDevices);

/**
 * @openapi
 * /api/discover:
 *   get:
 *     summary: Trigger network scan
 *     description: Clears the current list and starts a new SSDP discovery in the network (duration 5s).
 *     responses:
 *       200:
 *         description: Scan started
 */
router.get('/discover', TVController.discover);

/**
 * @openapi
 * /api/command/{ip}/{name}:
 *   post:
 *     summary: Send command to a TV
 *     description: Sends a specific IRCC or network command to the TV with the specified IP.
 *     parameters:
 *       - in: path
 *         name: ip
 *         required: true
 *         schema:
 *           type: string
 *         description: The IP address of the target TV
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the command (e.g., Power, VolumeUp)
 *     responses:
 *       200:
 *         description: Command successfully sent
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: TV not found
 *       500:
 *         description: Communication error with the device
 */
router.post('/command/:ip/:name', TVController.sendCommand);

/**
 * @openapi
 * /api/device/{ip}/register:
 *   post:
 *     summary: Initiate device registration
 *     description: Triggers the pairing process (e.g., displaying a PIN on the TV).
 *     parameters:
 *       - in: path
 *         name: ip
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registration initiated
 *       404:
 *         description: TV not found
 */
router.post('/device/:ip/register', TVController.register);

/**
 * @openapi
 * /api/device/{ip}/confirm-pin:
 *   post:
 *     summary: Confirm registration PIN
 *     description: Sends the PIN displayed on the TV to complete pairing.
 *     parameters:
 *       - in: path
 *         name: ip
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device registered successfully
 *       400:
 *         description: Invalid PIN or parameters
 *       404:
 *         description: TV not found
 */
router.post('/device/:ip/confirm-pin', TVController.confirmPin);

export default router;
