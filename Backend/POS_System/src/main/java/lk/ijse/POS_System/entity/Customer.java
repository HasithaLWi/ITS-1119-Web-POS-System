package lk.ijse.POS_System.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customers")
@Data // Magic! Auto-generates all Getters, Setters, toString, and equals/hashCode methods
@NoArgsConstructor // Required by Hibernate: creates an empty constructor
@AllArgsConstructor // Creates a constructor with all fields (id, name, email, phone)
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "phone", nullable = false, unique = true)
    private String phone;
    private String address;
}