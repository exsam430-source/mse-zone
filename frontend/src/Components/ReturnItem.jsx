const ReturnItem = ({ item, backendURL }) => {
  return (
    <div className="flex gap-4 border rounded-lg p-4 mb-3">
      <div className="flex-1">
        <p className="font-semibold">{item.productId.name}</p>
        <p className="text-sm text-gray-500">
          Qty: {item.quantity}
        </p>
        <p className="text-sm mt-1">
          Reason: {item.reason}
        </p>
      </div>

      {item.proof && (
        <img
          src={`${backendURL}${item.proof}`}
          className="w-20 h-20 rounded-lg object-cover border"
        />
      )}
    </div>
  );
};

export default ReturnItem;
