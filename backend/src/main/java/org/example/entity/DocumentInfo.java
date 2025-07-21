package org.example.entity;

import jakarta.persistence.*;

@Entity
public class DocumentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] idProof;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] incomeProof;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] addressProof;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] photo;


    @OneToOne
    @JoinColumn(name = "loan_application_id")
    private LoanApplication loanApplication;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LoanApplication getLoanApplication() {
        return loanApplication;
    }

    public void setLoanApplication(LoanApplication loanApplication) {
        this.loanApplication = loanApplication;
    }
}
