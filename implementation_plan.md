# Logistics Architecture & Workflow Plan

You have asked the most critical questions for any logistics system! Here is the proposed architecture to solve the challenges of tracking, intermediate stations, and missing goods.

## 1. Origin Station
**Problem:** The Sender books cargo and selects a destination, but what about the origin?
**Solution:** We will update the `BookCargo` form and the `Cargo` database entity to include an `originStationId`. 
- When a Sender books cargo, they select both "Drop-off Station" (Origin) and "Delivery Station" (Destination).
- The cargo will only show up in the Station Master's dashboard for the specific `originStation`.

## 2. Station Officer Integration (The Colombo -> Kalutara -> Galle Example)
**Problem:** A package goes through 3 stations, but an officer only works at one station.
**Solution:** Station Officers are assigned to **Stations**, not Trains. 
- **At Colombo (Origin):** The Colombo Officer scans the cargo when loading it onto the train. Status changes to `DISPATCHED_FROM_ORIGIN` (or `IN_TRANSIT`).
- **At Kalutara (Intermediate):** The Kalutara Officer scans the cargo while it's on the train. The system sees the destination is Galle, so it simply creates a **Tracking Log** ("Scanned at Kalutara") but keeps the status as `IN_TRANSIT`.
- **At Galle (Destination):** The Galle Officer scans the cargo as it is offloaded. The system sees the destination is Galle, and changes the status to `ARRIVED_AT_DESTINATION`.

## 3. How the QR Scanning Process Works
**Solution:** 
1. When cargo is registered, a QR Code is generated (we already use the `qrcode.react` library in the frontend for this).
2. The QR Code contains a secure string: `RAILPOST-CARGO-{cargoId}`.
3. The Station Officer logs into their dashboard on a mobile device or tablet.
4. They open the "Scan Cargo" page, which accesses the device camera.
5. They scan the QR code. The frontend sends the `cargoId` to the backend.
6. The backend checks the Officer's `stationId` and automatically logs the event and updates the status.

## 4. How do they know if goods are missing?
**Solution:**
- When a train leaves Colombo, the system knows exactly which 50 packages are assigned to that train.
- When the train arrives in Galle, the Galle officer scans all packages being offloaded.
- If they only scan 48 packages, the Station Master can open an **"Expected vs. Arrived" Report**.
- The system will highlight the 2 missing packages that were marked `IN_TRANSIT` on that train but never scanned at the destination. The status of these packages can be manually (or automatically) flagged as `MISSING`.

## 5. Sorting Goods at a Station
**Problem:** One station receives many goods for different destinations.
**Solution:** 
- In the Station Master / Officer dashboard, we will create a **"Sorting Hub"** view.
- This view will group all physical packages currently sitting at the station by their `destinationStation` and the `assignedTrain`.
- This tells the officers: "You have 15 packages going to Galle on Train A, and 10 going to Kandy on Train B. Load them now."

---

## Proposed Technical Changes

### Database Updates
- **Cargo Entity**: Add `originStationId`.
- **TrackingLog Entity (New)**: `{ id, cargoId, stationId, scannedByUserId, timestamp, action (LOADED, SCANNED_IN_TRANSIT, OFFLOADED) }`. This will power the public tracking timeline.

### API & Frontend Updates
- Update `BookCargo.jsx` to include an "Origin Station" dropdown.
- Update the Officer's `ScanCargo.jsx` to process intermediate scans vs destination scans.
- Create an "Expected Arrivals" report for the Station Master.

## User Review Required
> [!IMPORTANT]
> Does this workflow solve the logistical problems you were worried about? 
> 
> Specifically, do you agree with the **Tracking Log** approach where intermediate officers (like Kalutara) just scan the QR code to leave a "breadcrumb" trail for the tracking system without officially receiving the package? Let me know, and we can begin executing this workflow!
