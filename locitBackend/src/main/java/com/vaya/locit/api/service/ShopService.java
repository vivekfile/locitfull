package com.vaya.locit.api.service;

import com.vaya.locit.api.dto.NearbyShopResponse;
import com.vaya.locit.api.entity.Shop;
import com.vaya.locit.api.entity.User;
import com.vaya.locit.api.repository.ShopRepository;
import com.vaya.locit.api.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    public ShopService(ShopRepository shopRepository, UserRepository userRepository) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
    }

    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    public Shop getShopById(int id) {
        return shopRepository.findById(id).orElse(null);
    }

    public Shop createShop(Shop shop) {
        User seller = userRepository.findById(shop.getSeller().getUserId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        shop.setSeller(seller);
        return shopRepository.save(shop);
    }

    public List<Shop> getShopsBySeller(int sellerId) {
        return shopRepository.findBySellerUserId(sellerId);
    }

    public List<Shop> getShopsByCity(String city) {
        return shopRepository.findByCity(city);
    }

    public List<Shop> getShopsByState(String state) {
        return shopRepository.findByState(state);
    }

    public Shop updateShop(int id, Shop shop) {

        Shop existingShop = shopRepository.findById(id).orElse(null);

        if (existingShop == null) {
            return null;
        }

        existingShop.setSeller(shop.getSeller());
        existingShop.setShopName(shop.getShopName());
        existingShop.setDescription(shop.getDescription());
        existingShop.setAddress(shop.getAddress());
        existingShop.setCity(shop.getCity());
        existingShop.setState(shop.getState());
        existingShop.setPincode(shop.getPincode());
        existingShop.setLatitude(shop.getLatitude());
        existingShop.setLongitude(shop.getLongitude());

        return shopRepository.save(existingShop);
    }

    public boolean deleteShop(int id) {

        if (!shopRepository.existsById(id)) {
            return false;
        }

        shopRepository.deleteById(id);

        return true;
    }

    public List<NearbyShopResponse> getNearbyShops(
            double latitude,
            double longitude,
            double radiusKm) {

        return shopRepository.findAll().stream()
                .filter(shop -> shop.getLatitude() != null && shop.getLongitude() != null)
                .map(shop -> new NearbyShopResponse(
                        shop,
                        haversineKm(latitude, longitude, shop.getLatitude(), shop.getLongitude())))
                .filter(shop -> shop.getDistanceKm() <= radiusKm)
                .sorted(Comparator.comparingDouble(NearbyShopResponse::getDistanceKm))
                .collect(Collectors.toList());
    }

    private double haversineKm(
            double lat1,
            double lon1,
            double lat2,
            double lon2) {

        final double earthRadiusKm = 6371.0;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2)
                * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;
    }
}
