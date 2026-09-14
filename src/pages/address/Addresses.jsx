import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/api";
import "../../styles/address.css";

const emptyForm = {
    full_name: "",
    phone_number: "",
    address_lane: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    address_type: "HOME",
    is_default: false,
};

function Addresses() {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadAddresses();
    }, []);

    async function loadAddresses() {
        setLoading(true);
        setError("");

        try {
            const result = await apiRequest("/api/v1/address");

            if (result.status === 401) {
                navigate("/login");
                return;
            }

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                    result.data?.message ||
                    "Unable to load addresses."
                );
                return;
            }

            const responseData = result.data;

            const data = Array.isArray(responseData)
                ? responseData
                : Array.isArray(responseData?.data)
                    ? responseData.data
                    : Array.isArray(responseData?.addresses)
                        ? responseData.addresses
                        : Array.isArray(responseData?.data?.addresses)
                            ? responseData.data.addresses
                            : [];

            setAddresses(data);

            const defaultAddress = data.find(
                (address) => address.is_default
            );

            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.address_id);
            } else if (data.length > 0) {
                setSelectedAddressId(data[0].address_id);
            } else {
                setSelectedAddressId(null);
            }
        } catch (err) {
            console.error("Load address error:", err);
            setError("Unable to load your addresses.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function openAddForm() {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setSuccess("");
        setShowForm(true);
    }

    function openEditForm(address) {
        setEditingId(address.address_id);

        setForm({
            full_name: address.full_name || "",
            phone_number: address.phone_number || "",
            address_lane: address.address_lane || "",
            city: address.city || "",
            state: address.state || "",
            postal_code: address.postal_code || "",
            country: address.country || "India",
            address_type: address.address_type || "HOME",
            is_default: Boolean(address.is_default),
        });

        setError("");
        setSuccess("");
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                full_name: form.full_name.trim(),
                phone_number: form.phone_number.trim(),
                address_lane: form.address_lane.trim(),
                city: form.city.trim(),
                state: form.state.trim(),
                postal_code: Number(form.postal_code),
                country: form.country.trim(),
                address_type: form.address_type,
                is_default: form.is_default,
            };

            const endpoint = editingId
                ? `/api/v1/address/${editingId}`
                : "/api/v1/address";

            const result = await apiRequest(endpoint, {
                method: editingId ? "PUT" : "POST",
                body: JSON.stringify(payload),
            });

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                    result.data?.message ||
                    "Unable to save address."
                );
                return;
            }

            setSuccess(
                editingId
                    ? "Address updated successfully."
                    : "Address added successfully."
            );

            closeForm();

            await loadAddresses();
        } catch (err) {
            console.error("Address save error:", err);

            setError(
                err.message ||
                "Something went wrong while saving the address."
            );
        } finally {
            setSaving(false);
        }
    }

    async function makeDefault(addressId) {
        setError("");
        setSuccess("");

        try {
            const result = await apiRequest(
                `/api/v1/address/${addressId}/default`,
                {
                    method: "PATCH",
                }
            );

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                    result.data?.message ||
                    "Unable to update default address."
                );
                return;
            }

            setSelectedAddressId(addressId);
            setSuccess("Default address updated successfully.");

            await loadAddresses();
        } catch (err) {
            console.error("Default address error:", err);
            setError("Unable to update default address.");
        }
    }

    async function handlePlaceOrder() {
        if (!selectedAddressId) {
            setError("Please select a delivery address.");
            return;
        }

        setPlacingOrder(true);
        setError("");
        setSuccess("");

        try {
            const result = await apiRequest("/api/v1/orders", {
                method: "POST",
                body: JSON.stringify({
                    address_id: selectedAddressId,
                }),
            });

            if (result.status === 401) {
                navigate("/login");
                return;
            }

            if (!result.ok) {
                setError(
                    result.data?.detail ||
                    result.data?.message ||
                    "Unable to place your order."
                );
                return;
            }

            const orderId =
                result.data?.order_id ||
                result.data?.order?.order_id ||
                result.data?.data?.order_id;

            if (orderId) {
                navigate(`/orders/${orderId}`);
                return;
            }

            navigate("/orders");
        } catch (err) {
            console.error("Place order error:", err);
            setError("Something went wrong while placing your order.");
        } finally {
            setPlacingOrder(false);
        }
    }

    function getAddressTypeLabel(type) {
        switch (type) {
            case "HOME":
                return "Home";
            case "OFFICE":
                return "Office";
            default:
                return "Other";
        }
    }

    function getSelectedAddress() {
        return addresses.find(
            (address) => address.address_id === selectedAddressId
        );
    }

    const selectedAddress = getSelectedAddress();

    if (loading) {
        return (
            <main className="address-page">
                <div className="address-container">
                    <div className="address-loading">
                        <div className="loading-spinner" />
                        <h2>Loading your addresses</h2>
                        <p>Please wait while we prepare your checkout.</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="address-page">
            <div className="address-container">
                <div className="checkout-progress">
                    <div className="checkout-step completed">
                        <span>1</span>
                        <div>
                            <strong>Cart</strong>
                            <small>Review items</small>
                        </div>
                    </div>

                    <div className="checkout-line active" />

                    <div className="checkout-step active">
                        <span>2</span>
                        <div>
                            <strong>Delivery</strong>
                            <small>Choose address</small>
                        </div>
                    </div>

                    <div className="checkout-line" />

                    <div className="checkout-step">
                        <span>3</span>
                        <div>
                            <strong>Order</strong>
                            <small>Place order</small>
                        </div>
                    </div>
                </div>

                <div className="address-header">
                    <div>
                        <span className="section-eyebrow">
                            CHECKOUT · DELIVERY
                        </span>

                        <h1>Where should we deliver?</h1>

                        <p>
                            Select a saved address or add a new delivery
                            address for your order.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-address-button"
                        onClick={openAddForm}
                    >
                        + Add New Address
                    </button>
                </div>

                {error && (
                    <div className="address-alert error">
                        <span>!</span>
                        <div>{error}</div>
                    </div>
                )}

                {success && (
                    <div className="address-alert success">
                        <span>✓</span>
                        <div>{success}</div>
                    </div>
                )}

                <div className="address-checkout-layout">
                    <section className="address-section">
                        <div className="section-heading-row">
                            <div>
                                <span className="section-eyebrow">
                                    SAVED ADDRESSES
                                </span>

                                <h2>Choose a delivery address</h2>
                            </div>

                            {addresses.length > 0 && (
                                <span className="address-count">
                                    {addresses.length}{" "}
                                    {addresses.length === 1
                                        ? "address"
                                        : "addresses"}
                                </span>
                            )}
                        </div>

                        {addresses.length === 0 ? (
                            <div className="no-addresses">
                                <div className="no-address-icon">📍</div>

                                <h2>No saved addresses</h2>

                                <p>
                                    Add a delivery address to continue with
                                    your order.
                                </p>

                                <button
                                    type="button"
                                    className="primary-address-button"
                                    onClick={openAddForm}
                                >
                                    Add Your Address
                                </button>
                            </div>
                        ) : (
                            <div className="address-list">
                                {addresses.map((address) => {
                                    const selected =
                                        selectedAddressId ===
                                        address.address_id;

                                    return (
                                        <article
                                            key={address.address_id}
                                            className={`address-card ${selected ? "selected" : ""
                                                }`}
                                            onClick={() =>
                                                setSelectedAddressId(
                                                    address.address_id
                                                )
                                            }
                                        >
                                            <div className="address-card-top">
                                                <label className="address-select">
                                                    <input
                                                        type="radio"
                                                        name="selectedAddress"
                                                        checked={selected}
                                                        onChange={() =>
                                                            setSelectedAddressId(
                                                                address.address_id
                                                            )
                                                        }
                                                    />

                                                    <span className="radio-custom" />
                                                </label>

                                                <div className="address-card-labels">
                                                    <span className="address-type">
                                                        {getAddressTypeLabel(
                                                            address.address_type
                                                        )}
                                                    </span>

                                                    {address.is_default && (
                                                        <span className="default-badge">
                                                            ✓ Default
                                                        </span>
                                                    )}

                                                    {selected && (
                                                        <span className="selected-badge">
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="address-details">
                                                <h3>{address.full_name}</h3>

                                                <p>{address.address_lane}</p>

                                                <p>
                                                    {address.city},{" "}
                                                    {address.state}{" "}
                                                    {address.postal_code}
                                                </p>

                                                <p>{address.country}</p>

                                                <p className="address-phone">
                                                    <span>☎</span>{" "}
                                                    {address.phone_number}
                                                </p>
                                            </div>

                                            <div className="address-card-actions">
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        openEditForm(address);
                                                    }}
                                                >
                                                    Edit Address
                                                </button>

                                                {!address.is_default && (
                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            makeDefault(
                                                                address.address_id
                                                            );
                                                        }}
                                                    >
                                                        Make Default
                                                    </button>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <aside className="checkout-summary">
                        <span className="section-eyebrow">
                            ORDER CONFIRMATION
                        </span>

                        <h2>Ready to place your order?</h2>

                        <p>
                            We'll use the selected address as the shipping
                            destination for this order.
                        </p>

                        <div className="selected-address-preview">
                            <div className="preview-icon">📍</div>

                            <div>
                                <span>Delivering to</span>

                                {selectedAddress ? (
                                    <>
                                        <strong>
                                            {selectedAddress.full_name}
                                        </strong>

                                        <p>
                                            {selectedAddress.city},{" "}
                                            {selectedAddress.state}
                                        </p>
                                    </>
                                ) : (
                                    <strong>Select an address</strong>
                                )}
                            </div>
                        </div>

                        <div className="checkout-summary-box">
                            <div>
                                <span>Delivery</span>
                                <strong>Standard Delivery</strong>
                            </div>

                            <div>
                                <span>Payment</span>
                                <strong>Available at checkout</strong>
                            </div>

                            <div>
                                <span>Order status</span>
                                <strong>Pending confirmation</strong>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="place-order-button"
                            disabled={
                                !selectedAddressId ||
                                placingOrder ||
                                addresses.length === 0
                            }
                            onClick={handlePlaceOrder}
                        >
                            {placingOrder
                                ? "Placing Your Order..."
                                : "Place Order →"}
                        </button>

                        <button
                            type="button"
                            className="back-to-cart-button"
                            onClick={() => navigate("/cart")}
                        >
                            ← Back to Cart
                        </button>

                        <div className="checkout-security">
                            <span>🔒</span>

                            <div>
                                <strong>Secure Order Processing</strong>

                                <p>
                                    Your order and delivery information are
                                    protected.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>

                {showForm && (
                    <div
                        className="address-modal-overlay"
                        onClick={closeForm}
                    >
                        <div
                            className="address-modal"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="address-modal-header">
                                <div>
                                    <span className="section-eyebrow">
                                        ADDRESS MANAGEMENT
                                    </span>

                                    <h2>
                                        {editingId
                                            ? "Edit Address"
                                            : "Add New Address"}
                                    </h2>

                                    <p>
                                        Enter your delivery information below.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="close-modal-button"
                                    onClick={closeForm}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>

                            <form
                                className="address-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="form-grid">
                                    <div className="form-group full">
                                        <label htmlFor="full_name">
                                            Full Name
                                        </label>

                                        <input
                                            id="full_name"
                                            type="text"
                                            name="full_name"
                                            value={form.full_name}
                                            onChange={handleChange}
                                            placeholder="Enter full name"
                                            autoComplete="name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone_number">
                                            Phone Number
                                        </label>

                                        <input
                                            id="phone_number"
                                            type="tel"
                                            name="phone_number"
                                            value={form.phone_number}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            autoComplete="tel"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="postal_code">
                                            Postal Code
                                        </label>

                                        <input
                                            id="postal_code"
                                            type="number"
                                            name="postal_code"
                                            value={form.postal_code}
                                            onChange={handleChange}
                                            placeholder="Enter postal code"
                                            inputMode="numeric"
                                            required
                                        />
                                    </div>

                                    <div className="form-group full">
                                        <label htmlFor="address_lane">
                                            Address
                                        </label>

                                        <textarea
                                            id="address_lane"
                                            name="address_lane"
                                            value={form.address_lane}
                                            onChange={handleChange}
                                            placeholder="House / Flat / Street / Area"
                                            rows="3"
                                            autoComplete="street-address"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="city">City</label>

                                        <input
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            autoComplete="address-level2"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="state">State</label>

                                        <input
                                            id="state"
                                            type="text"
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                            autoComplete="address-level1"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="country">Country</label>

                                        <input
                                            id="country"
                                            type="text"
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                            placeholder="Country"
                                            autoComplete="country-name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address_type">
                                            Address Type
                                        </label>

                                        <select
                                            id="address_type"
                                            name="address_type"
                                            value={form.address_type}
                                            onChange={handleChange}
                                        >
                                            <option value="HOME">
                                                Home
                                            </option>

                                            <option value="OFFICE">
                                                Office
                                            </option>

                                            <option value="OTHER">
                                                Other
                                            </option>
                                        </select>
                                    </div>

                                    <div className="form-group full">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="is_default"
                                                checked={form.is_default}
                                                onChange={handleChange}
                                            />

                                            <span>
                                                Make this my default delivery
                                                address
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-form-button"
                                        onClick={closeForm}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="save-address-button"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : editingId
                                                ? "Update Address"
                                                : "Save Address"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Addresses;