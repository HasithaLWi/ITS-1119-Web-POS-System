package lk.ijse.POS_System.repository;


import lk.ijse.POS_System.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Tells Spring this is a database interaction class
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // By simply extending JpaRepository, you instantly get methods like:
    // .save(), .findAll(), .findById(), and .deleteById() for free!
}