# Rails.application.configure do
#     config.after_initialize do
#         Rails.logger = JohnsBetterLogger.new(Rails.logger)
#         # formatter = Rails.log_formatter
#         # Rails.log_formatter = proc do | severity, datetime, progname, msg |
#         #     "#{datetime.strftime('%Y-%m-%d %H:%M:%S.%3N')} #{severity.to_s.first}: #{msg[0] == "[" && msg[37] == "]" ? msg.first(9) + "..]" + msg[38..-1] : msg}\n"
#         # end
#         Rails.logger.level = 0
#     end
# end

# class JohnsBetterLogger
#     def self.wrap_with_format(*methods)
#         methods.each do |method|
#             define_method(method) do |*args, &block|
#                 progname = args[0]
#                 caller_str = caller.first
#                 if block_given?
#                     @base.send(method, progname) { format(caller_str, &block) }
#                 else
#                     @base.send(method, format(caller_str, progname))
#                 end
#             end
#         end
#     end

#     wrap_with_format :debug, :info, :warn, :error, :fatal

#     def initialize(base)
#         @base = base
#         info "Using JohnsBetterLogger with format |file:line:method: message|"
#     end

#     def method_missing(method, *args)
#         @base.send(method, *args)
#     end

#     def format(caller_str, message)
#         _, file, line, method = caller_str.match(/\/?(.+?):(\d+?):in `(.+?)'/).to_a
#         "#{file}:#{line}:#{method}: #{message}"
#     end
# end
