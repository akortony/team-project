// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareManagement {
    struct Patient {
        string firstName;
        string lastName;
        string email;
        string addressLine;
        string postalCode;
        string insuranceID;
        string primaryContact;
        string alternateContact;
    }

    mapping(address => Patient) public patients;
    address[] public patientAddresses;

    event PatientRegistered(address indexed patientAddress, string firstName, string lastName);

    function registerPatient(
        string memory _firstName,
        string memory _lastName,
        string memory _email,
        string memory _addressLine,
        string memory _postalCode,
        string memory _insuranceID,
        string memory _primaryContact,
        string memory _alternateContact
    ) public {
        require(bytes(_firstName).length > 0, "First name is required");
        require(bytes(_lastName).length > 0, "Last name is required");
        require(bytes(_email).length > 0, "Email is required");
        require(bytes(_addressLine).length > 0, "Address is required");
        require(bytes(_postalCode).length > 0, "Postal code is required");
        require(bytes(_insuranceID).length > 0, "Insurance ID is required");
        require(bytes(_primaryContact).length > 0, "Primary contact is required");

        patients[msg.sender] = Patient(
            _firstName,
            _lastName,
            _email,
            _addressLine,
            _postalCode,
            _insuranceID,
            _primaryContact,
            _alternateContact
        );

        patientAddresses.push(msg.sender);
        emit PatientRegistered(msg.sender, _firstName, _lastName);
    }

    function getPatient(address _patientAddress) public view returns (Patient memory) {
        return patients[_patientAddress];
    }
}