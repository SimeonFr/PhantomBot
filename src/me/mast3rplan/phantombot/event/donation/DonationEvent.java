/* 
 * Copyright (C) 2015 www.phantombot.net
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package me.mast3rplan.phantombot.event.donation;

import me.mast3rplan.phantombot.event.Event;
import me.mast3rplan.phantombot.jerklib.Channel;

public class DonationEvent extends Event
{
    private final String donator;
    private final float amount;
    private final String message;
    private final Channel channel;

    public DonationEvent(String donator, float amount)
    {
        this(donator, amount, null);
    }

    public DonationEvent(String donator, float amount, String message)
    {
        this(donator, amount, message, null);
    }

    public DonationEvent(String donator, float amount, String message, Channel channel)
    {
    	this.donator = donator;
        this.amount = amount;
        this.message = message;
        this.channel = channel;
    }

    public String getDonator()
    {
        return this.donator;
    }
    
    public float getAmount()
    {
        return this.amount;
    }
    
    public String getMessage()
    {
    	if (this.message == null)
    	{
    		return "";
    	}
        return this.message;
    }
    
    public Channel getChannel()
    {
        return this.channel;
    }
    
    public String toEventSocket()
    {
    	return this.getAmount() + "|" + this.getMessage() + "|" + this.getChannel();
    }
}