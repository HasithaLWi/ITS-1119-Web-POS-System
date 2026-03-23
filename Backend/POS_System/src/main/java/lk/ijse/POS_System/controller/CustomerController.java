package lk.ijse.POS_System.controller;


import lk.ijse.POS_System.entity.Customer;
import lk.ijse.POS_System.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Tells Spring this class handles web requests
@RequestMapping("/api/customers") // The base URL for all customer actions
@CrossOrigin(origins = "*") // Allows your frontend web application to connect without security block errors
@RequiredArgsConstructor // Lombok magic: automatically connects the CustomerRepository below
public class CustomerController {

    private final CustomerRepository customerRepository;

    // 1. SAVE A NEW CUSTOMER
    // Listens for a POST request at: http://localhost:8080/api/customers/save
    @PostMapping("/save")
    public Customer saveCustomer(@RequestBody Customer customer) {
        // @RequestBody takes the JSON from your frontend and converts it to a Java Customer object
        return customerRepository.save(customer);
    }

    // 2. GET ALL CUSTOMERS
    // Listens for a GET request at: http://localhost:8080/api/customers/all
    @GetMapping("/all")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}