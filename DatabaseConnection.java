import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    public static Connection getConnection() throws SQLException {
        String url = "jdbc:mysql://localhost:5432/warehouse_db"; // Update with your database info
        String user = "root";
        String password = "mysql"; // Your database password
        return DriverManager.getConnection(url, user, password);
    }
}
