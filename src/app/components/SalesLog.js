import React from 'react';
import '../styles/salesLog.css';

const SalesLog = ({ sales }) => {
    return (
        <div className="sales-log">
            <h3>Siste salg</h3>
            <div className="sales-list">
                {sales.slice(-10).reverse().map((sale) => (
                    <div key={sale.uniqueReceiptId} className="sale-item">
                        <div className="sale-header">
                            <strong>Butikk #{sale.storeNo}</strong>
                            <span className="sale-time">
                                {new Date(sale.transDateTime).toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="sale-details">
                            <div>Beløp: {parseFloat(sale.receiptTotalIncVat).toFixed(2)} NOK</div>
                            <div>Antall varer: {sale.quantityOfItems}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SalesLog; 