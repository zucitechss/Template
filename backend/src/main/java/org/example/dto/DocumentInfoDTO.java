package org.example.dto;

public class DocumentInfoDTO {
    private byte[] idProof;
    private byte[] incomeProof;
    private byte[] addressProof;
    private byte[] photo;

    public byte[] getIdProof() {
        return idProof;
    }

    public void setIdProof(byte[] idProof) {
        this.idProof = idProof;
    }

    public byte[] getIncomeProof() {
        return incomeProof;
    }

    public void setIncomeProof(byte[] incomeProof) {
        this.incomeProof = incomeProof;
    }

    public byte[] getAddressProof() {
        return addressProof;
    }

    public void setAddressProof(byte[] addressProof) {
        this.addressProof = addressProof;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }
}
