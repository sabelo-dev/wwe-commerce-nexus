
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Truck, CreditCard } from "lucide-react";

const PromoSection: React.FC = () => {
  const promos = [
    {
      title: "Limited Time Offer",
      description: "Get up to 50% off on selected items until this weekend",
      buttonText: "Shop Now",
      link: "/deals",
      bgColor: "bg-rose-100",
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      title: "New Summer Collection",
      description: "Discover the latest trends for the season",
      buttonText: "View Collection",
      link: "/new-arrivals",
      bgColor: "bg-blue-100",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ];

  const features = [
    {
      icon: <Truck className="h-6 w-6 text-wwe-navy" />,
      title: "Fast Shipping",
      description: "Free shipping on orders over $50",
    },
    {
      icon: <CreditCard className="h-6 w-6 text-wwe-navy" />,
      title: "Secure Payment",
      description: "Multiple payment methods accepted",
    },
    {
      icon: <Clock className="h-6 w-6 text-wwe-navy" />,
      title: "24/7 Support",
      description: "Contact us anytime for assistance",
    },
  ];

  return (
    <section className="py-12">
      <div className="wwe-container">
        {/* Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {promos.map((promo, index) => (
            <div
              key={index}
              className={`${promo.bgColor} rounded-lg overflow-hidden shadow-md`}
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold mb-3">{promo.title}</h3>
                  <p className="text-gray-700 mb-5">{promo.description}</p>
                  <div className="mt-auto">
                    <Link to={promo.link}>
                      <Button className="bg-wwe-navy hover:bg-wwe-navy/90">
                        {promo.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/2 aspect-video md:aspect-auto">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-gray-100 p-3 rounded-full mr-4">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
