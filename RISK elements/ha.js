try {
    const addressId = req.params.id;

    // Check if the address you're deleting is default
    const isDefaultAddress = await addressModal.findById(addressId);
    if (!isDefaultAddress) return res.status(404).json({ message: "Address not found" });

    // Delete the address
    await addressModal.findByIdAndDelete(addressId);

    // If the deleted one was default, make the latest one as default
    if (isDefaultAddress.isDefault) {
        const latestAddress = await addressModal
            .findOne({ userId: isDefaultAddress.userId })  // Assuming userId is stored in address
            .sort({ createdAt: -1 });

        if (latestAddress) {
            latestAddress.isDefault = true;
            await latestAddress.save();
        }
    }

    return res.status(200).json({ message: "Address Deleted successfully" });

} catch (error) {
    console.log(`Error in deleteAddress controller: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
}
