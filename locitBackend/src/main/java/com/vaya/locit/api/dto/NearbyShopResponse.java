package com.vaya.locit.api.dto;

import com.vaya.locit.api.entity.Shop;

public class NearbyShopResponse {

    private int shopId;
    private String shopName;
    private String description;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private double distanceKm;
    private String sellerName;

    public NearbyShopResponse(Shop shop, double distanceKm) {
        this.shopId = shop.getShopId();
        this.shopName = shop.getShopName();
        this.description = shop.getDescription();
        this.address = shop.getAddress();
        this.city = shop.getCity();
        this.state = shop.getState();
        this.pincode = shop.getPincode();
        this.latitude = shop.getLatitude();
        this.longitude = shop.getLongitude();
        this.distanceKm = distanceKm;
        this.sellerName = shop.getSeller() != null ? shop.getSeller().getName() : null;
    }

    public int getShopId() {
        return shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public String getDescription() {
        return description;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getPincode() {
        return pincode;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public String getSellerName() {
        return sellerName;
    }
}
