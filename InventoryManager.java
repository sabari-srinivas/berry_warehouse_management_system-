import java.sql.*;

public class InventoryManager {
    public void addShipment(String berryType, String batchNumber, Date harvestDate, int quantity, String storageLocation) throws SQLException {
        try (Connection conn = DatabaseConnection.getConnection();
             CallableStatement stmt = conn.prepareCall("{CALL add_shipment(?, ?, ?, ?, ?)}")) {
            stmt.setString(1, berryType);
            stmt.setString(2, batchNumber);
            stmt.setDate(3, harvestDate);
            stmt.setInt(4, quantity);
            stmt.setString(5, storageLocation);
            stmt.execute();
        }
    }

    public void updateStock(int id, int quantity, String storageLocation) throws SQLException {
        try (Connection conn = DatabaseConnection.getConnection();
             CallableStatement stmt = conn.prepareCall("{CALL update_stock(?, ?, ?)}")) {
            stmt.setInt(1, id);
            stmt.setInt(2, quantity);
            stmt.setString(3, storageLocation);
            stmt.execute();
        }
    }

    public ResultSet viewStock() throws SQLException {
        Connection conn = DatabaseConnection.getConnection();
        Statement stmt = conn.createStatement();
        return stmt.executeQuery("SELECT * FROM stock_inventory");
    }

    public void deleteStock(int id) throws SQLException {
        try (Connection conn = DatabaseConnection.getConnection();
             CallableStatement stmt = conn.prepareCall("{CALL delete_stock(?)}")) {
            stmt.setInt(1, id);
            stmt.execute();
        }
    }
}
