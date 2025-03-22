// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareSystem {
    struct Doctor {
        string name;
        string specialization;
        string email;
        string username;
        bytes32 passwordHash;
        string doctorId; // Unique doctor ID
        string licenseNumber;
        uint256 yearsOfExperience;
        string clinicName;
        string contactNumber;
        string addressDetails;
        bool isRegistered;
    }

    

    address[] public registeredDoctors;

    mapping(address => Doctor) public doctors;

    mapping(string => address) private usernameToAddress; // Maps username to doctor’s address

    mapping(string => bool) private usernameExists;
    mapping(string => bool) private doctorIdExists; // To ensure unique Doctor ID

    mapping(address => mapping(string => string[])) private doctorAvailability; // Doctor -> (Date -> Time Slots)
    mapping(address => bytes32) private passwordResetCodes; // Stores password reset codes


    event DoctorRegistered(address indexed doctorAddress, string username);
    event PasswordResetRequested(address indexed doctorAddress, bytes32 resetCode);
    event PasswordResetSuccessful(address indexed doctorAddress);

    function registerDoctor(
        address _doctorAddress,
        string memory _name,
        string memory _specialization,
        string memory _email,
        string memory _username,
        string memory _doctorId,
        string memory _licenseNumber,
        uint256 _yearsOfExperience,
        string memory _clinicName,
        string memory _contactNumber,
        string memory _addressDetails
    ) public {
        require(!doctors[_doctorAddress].isRegistered, "Doctor already registered");
        require(!usernameExists[_username], "Username already taken");
        require(!doctorIdExists[_doctorId], "Doctor ID already exists");

        doctors[_doctorAddress] = Doctor({
            name: _name,
            specialization: _specialization,
            email: _email,
            username: _username,
            passwordHash: 0,
            doctorId: _doctorId,
            licenseNumber: _licenseNumber,
            yearsOfExperience: _yearsOfExperience,
            clinicName: _clinicName,
            contactNumber: _contactNumber,
            addressDetails: _addressDetails,
            isRegistered: true
        });

        usernameExists[_username] = true;
        doctorIdExists[_doctorId] = true;
        usernameToAddress[_username] = _doctorAddress;

        registeredDoctors.push(_doctorAddress);

        emit DoctorRegistered(_doctorAddress, _username);
    }

}
