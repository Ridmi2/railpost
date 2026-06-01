package com.railpost.util;

import com.railpost.model.document.Cargo;
import com.railpost.model.enums.CargoStatus;
import com.railpost.repository.CargoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Runs every hour and expires online bookings
 * where the sender did not drop off within 3 days.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BookingExpiryScheduler {

    private final CargoRepository cargoRepository;

    @Scheduled(fixedRate = 3600000) // every 1 hour
    public void expireOldBookings() {
        List<Cargo> expired = cargoRepository.findByStatusAndExpiresAtBefore(
                CargoStatus.PENDING_DROP_OFF, LocalDateTime.now());

        if (expired.isEmpty()) return;

        expired.forEach(cargo -> {
            cargo.setStatus(CargoStatus.EXPIRED);
            cargo.getStatusHistory().add(Cargo.StatusUpdate.builder()
                    .status(CargoStatus.EXPIRED)
                    .note("Booking expired — cargo not dropped off within 3 days")
                    .timestamp(LocalDateTime.now())
                    .build());
        });

        cargoRepository.saveAll(expired);
        log.info("Expired {} pending bookings", expired.size());
    }
}
