package com.planorama.backend.common;

import com.planorama.backend.event.api.EventDTO;
import com.planorama.backend.guest.api.GuestDTO;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class MessagingUtil {
    private static final String INVITATION_TEXT = """
            Hello, you have been invited to the event: %s, that occurs on %s.
            Click below for more details and to approve RSVP:
            %s
            """;
    private static final String REMINDER_TEXT = """
            Dear %s,
            We are excited to party for %s today at %s.
            Your seat is at table number %s
            You can bring a present using the following link:
            %s
            """;

    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    @Value("${twilio.sid}")
    private String sid;

    @Value("${twilio.token}")
    private String token;

    @Value("${twilio.whatsapp.phone}")
    private String whatsappPhoneNumber;

    @Value("${twilio.sms.phone}")
    private String smsPhoneNumber;

    @Value("${twilio.whatsapp.enable}")
    private boolean isWhatsappEnable;

    @Value("${client.dns}")
    private String clientDNS;

    @PostConstruct
    public void initTwilio() {
        Twilio.init(sid, token);
    }

    private void send(String phoneNumber, String body) {
        String from = (isWhatsappEnable ? "whatsapp:+" : "+") + phoneNumber;
        String to = isWhatsappEnable ? "whatsapp:" + whatsappPhoneNumber : smsPhoneNumber;

        Message.creator(new PhoneNumber(from),
                new PhoneNumber(to),
                body).create();
    }

    public void sendInvitation(EventDTO event, GuestDTO guest) {
        String link = clientDNS + "rsvp/" + guest.id();
        String message = INVITATION_TEXT.formatted(event.name(), event.time().format(dateFormatter), link);
        send(guest.phoneNumber(), message);
    }

    public void sendReminder(EventDTO event, GuestDTO guest, Integer tableNumber) {
        String link = clientDNS + "gift/" + guest.id();
        String message = REMINDER_TEXT.formatted(guest.name(), event.name(), event.time().format(timeFormatter), tableNumber, link);
        send(guest.phoneNumber(), message);
    }
}